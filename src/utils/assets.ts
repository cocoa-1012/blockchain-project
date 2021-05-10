/* eslint-disable max-lines */
import {
  propEq,
  ifElse,
  allPass,
  curry,
  compose,
  prop,
  includes,
  propSatisfies,
  when,
  is,
  cond,
  pick,
  T,
} from 'ramda';
import qs from 'qs';

import { getFileName, isValidURL } from 'utils/urls';
import { notEmptyOrNil } from 'utils/helpers';

import {
  videoAssetsHost,
  imageAssetsHost,
  appAssetsHost,
  modelImageAssetsHost,
} from 'lib/assets';

import Artwork, { BasicArtwork, ArtworkAssetFields } from 'types/Artwork';
import { VideoAssetQuality, VideoAssetOptions } from 'types/Assets';
import Account from 'types/Account';

export const MODEL_FORMAT_EXTENSIONS = [
  { extension: 'glb', mimetype: 'model/gltf-binary' },
  { extension: 'gltf', mimetype: 'model/gltf+json' },
];

const getIpfsHash = (assetIpfsPath: string) => {
  return when(
    notEmptyOrNil,
    (assetIpfsPath) => assetIpfsPath.split('/').shift(),
    assetIpfsPath
  );
};

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) {
    return '0 Byte';
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export const isVideo = (fileUrl: string): boolean =>
  /\.(mp4)$/i.test(getFileName(fileUrl));

export const isModel = (fileUrl: string): boolean =>
  /\.(gltf|glb)$/i.test(getFileName(fileUrl));

export const createModelMimeType = (fileName: string): string => {
  const fileExtension = fileName.split('.').pop();
  const modelMimetype = MODEL_FORMAT_EXTENSIONS.find(
    (o) => o.extension === fileExtension
  );

  return modelMimetype ? modelMimetype.mimetype : null;
};

interface ImgixOptions {
  q?: number;
  w?: number;
  h?: number;
  'max-w'?: number;
  'max-h'?: number;
  'min-h'?: number;
  'min-w'?: number;
  auto?: 'format' | 'compress' | 'format,compress';
  fit?: 'crop' | 'fill';
  fm?: 'jpg' | 'webp' | 'png';
  dpr?: number;
  bg?: string;
}

const IMGIX_OPTION_KEYS: (keyof ImgixOptions)[] = [
  'q',
  'w',
  'h',
  'auto',
  'fit',
  'max-w',
  'max-h',
  'min-h',
  'min-w',
  'fm',
  'dpr',
  'bg',
];

interface AssetOptions extends ImgixOptions, VideoAssetOptions {}

export function buildImgixUrl(
  url: string,
  options: ImgixOptions = {},
  hostname = appAssetsHost
): string {
  const hasUrl = notEmptyOrNil(url);
  if (!hasUrl) {
    return null;
  }

  // pick out only the options relevant to imgix
  const imageOptions = pick<ImgixOptions, string>(IMGIX_OPTION_KEYS, {
    // default options
    q: 80,
    // override options
    ...options,
  });

  const queryString = qs.stringify(imageOptions);

  try {
    const urlObject = new URL(url);

    return `${hostname}${urlObject.pathname}?${queryString}`;
  } catch (error) {
    return `${hostname}/${url}?${queryString}`;
  }
}

export function buildImgixIPFSUrl(
  ipfsPath = '',
  options: ImgixOptions = {}
): string {
  const imageOptions = pick<ImgixOptions, string>(IMGIX_OPTION_KEYS, options);

  const imgixOpts: ImgixOptions = {
    q: 80,
    ...imageOptions,
  };
  const queryString = qs.stringify(imgixOpts);

  try {
    const urlObject = new URL(imageAssetsHost);

    // Note: The ipfs part of the path isn't needed since that's contained
    // in the Imgix web folder config
    urlObject.pathname = `/${ipfsPath}`;

    urlObject.search = queryString;
    const urlString = urlObject.toString();
    return urlString;
  } catch (error) {
    // TODO: Send error to Sentry
    console.error(error);
    throw error;
  }
}

export const buildImgixUrlNew = curry(
  (options: ImgixOptions, url: string): string => {
    return buildImgixUrl(url, options);
  }
);

export const whenURLIsValid = curry(
  (fn: (arg0: string) => string, url: string) =>
    ifElse(
      // test whether the string is a valid URL
      isValidURL,
      // if the URL is valid, call the asset builder fn
      () => fn(url),
      // otherwise return null
      () => null
    )(url)
);

export const buildAvatarUrlNew = whenURLIsValid(
  buildImgixUrlNew({ w: 96, q: 60 })
);

export const buildImageWithOptions = curry(
  (options: ImgixOptions, imageUrl: string) => {
    const urlObject = new URL(imageUrl);
    const urlQuery = qs.parse(urlObject.search);
    urlObject.search = qs.stringify({ ...urlQuery, ...options });
    return urlObject.toString();
  }
);

export const buildArtworkCardIPFSImage = buildImageWithOptions({
  h: 400,
  q: 60,
});

export const buildArtworkPageIPFSImage = buildImageWithOptions({
  h: 1280,
  q: 90,
});

export const buildProfileShareImageUrl = whenURLIsValid(
  buildImgixUrlNew({ w: 1680, q: 70, fm: 'jpg' })
);

export const mimeTypeExtensions = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'video/mp4': 'mp4',
};

interface FileDimensions {
  width: number;
  height: number;
  duration?: number;
}

export const getDimensionsFromImage = (file: File): Promise<FileDimensions> =>
  new Promise((resolve) => {
    const fileAsDataURL = window.URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width,
      });
    };
    img.src = fileAsDataURL;
  });

export const getDimensionsFromVideo = (file: File): Promise<FileDimensions> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
    };
  });

// if the file’s type contains `video/` return true
const hasVideoMimeType = compose(includes('video/'), prop('type'));
const hasImageMimeType = compose(includes('image/'), prop('type'));

// if it’s a video mimeType, use the video file handler
// otherwise use the image one
const handleFileByType = cond([
  [hasVideoMimeType, getDimensionsFromVideo],
  [hasImageMimeType, getDimensionsFromImage],
  [T, () => ({ width: 0, height: 0 })],
]);

export const getDimensionsFromFile = (file: File): Promise<FileDimensions> => {
  return handleFileByType(file);
};

export const getUserProfileHero = compose<Account, string, string>(
  whenURLIsValid(buildImgixUrlNew({ q: 90, w: 1500 })),
  prop('coverImageUrl')
);

export const getCreatorCardHero = compose<Account, string, string>(
  whenURLIsValid(
    buildImgixUrlNew({
      q: 30,
      'min-w': 400,
      'min-h': 200,
      fit: 'crop',
      auto: 'format,compress',
    })
  ),
  prop('coverImageUrl')
);

export const getCreatorAvatarImage = compose<Account, string, string>(
  whenURLIsValid(buildImgixUrlNew({ q: 70, w: 320, fit: 'fill' })),
  prop('profileImageUrl')
);

const isString = is(String);

// artwork has a video mimeType
const isVideoMimeType = propSatisfies(
  // guard the check only when it’s a string
  when(isString, includes('video/')),
  'mimeType'
);
const isImageMimeType = propSatisfies(
  // guard the check only when it’s a string
  when(isString, includes('image/')),
  'mimeType'
);
const isModelMimeType = propSatisfies(
  // guard the check only when it’s a string
  when(isString, includes('model/')),
  'mimeType'
);

const hasVideoAssetId = propSatisfies(notEmptyOrNil, 'assetId');
const hasVideoAssetSuccessStatus = propEq('assetStatus', 'SUCCESS');
const hasVideoAssetPendingStatus = propEq('assetStatus', 'PENDING');

export const hasSuccessfulStatusAndVideoAssetId = allPass([
  hasVideoAssetSuccessStatus,
  hasVideoAssetId,
]);

// when it is a video with a assetStatus === PENDING
export const hasVideoAssetProcessingStatus = allPass([
  isVideoMimeType,
  hasVideoAssetPendingStatus,
]);

export const buildS3BaseAssetUrl = (assetId: string): string => {
  // For perf reasons we generate extra folders as it allows for more throughput
  // folder1 is 2 letters from the 4th from the end
  // folder2 is 2 letters from the 2nd from the end
  const folder1 = assetId.substr(-4, 2);
  const folder2 = assetId.substr(-2, 2);

  // Use the last 4 chars of the assetIPFSId to ensure even distribution of keys on first characters
  return `${folder1}/${folder2}/${assetId}`;
};

const buildPreviewVideoUrl = cond([
  [
    propEq('assetVersion', 3),
    (artwork: Artwork) =>
      `${videoAssetsHost}/${buildS3BaseAssetUrl(
        artwork.assetId
      )}/nft_preview_q3.mp4`,
  ],
  [
    T,
    (artwork: Artwork) =>
      `${videoAssetsHost}/${buildS3BaseAssetUrl(
        artwork.assetId
      )}/nft_preview.mp4`,
  ],
]);

const buildVideoUrl = cond([
  [
    propEq('assetVersion', 3),
    (artwork: Artwork) =>
      `${videoAssetsHost}/${buildS3BaseAssetUrl(artwork.assetId)}/nft_q4.mp4`,
  ],
  [
    T,
    (artwork: Artwork) =>
      `${videoAssetsHost}/${buildS3BaseAssetUrl(artwork.assetId)}/nft.mp4`,
  ],
]);

export const buildPosterImageUrl = (artwork: Artwork): string => {
  return `${videoAssetsHost}/${buildS3BaseAssetUrl(artwork.assetId)}/nft.jpg`;
};

const buildModelPosterImageUrl = (
  artwork: Artwork,
  options?: AssetOptions
): string => {
  const path = compose(buildS3BaseAssetUrl, getIpfsHash)(artwork.assetIPFSPath);
  const url = `${modelImageAssetsHost}/${path}/nft.png`;

  return buildImgixUrl(url, options, modelImageAssetsHost);
};

export const buildArtworkModelUrl = (artwork: Artwork): string => {
  return buildIPFSAssetUrl(artwork);
};

export const buildGifImageUrl = (artwork: Artwork): string => {
  return `${videoAssetsHost}/${buildS3BaseAssetUrl(artwork.assetId)}/nft.gif`;
};

export const buildPosterUrl = cond([
  [
    (artwork) => isModel(artwork.assetIPFSPath),
    (artwork, options) => buildModelPosterImageUrl(artwork, options),
  ],
  [hasSuccessfulStatusAndVideoAssetId, buildPosterImageUrl],
  [T, () => null],
]);

const buildVideoAssetPlaybackUrl = (options: AssetOptions, artwork: Artwork) =>
  cond([
    [
      propEq('quality', VideoAssetQuality.Preview),
      () => buildPreviewVideoUrl(artwork),
    ],
    [T, () => buildVideoUrl(artwork)],
  ])(options);

// Only used for videos, not images
export const buildIPFSAssetUrl = compose(
  (assetIPFSPath) => `https://ipfs.foundation.app/ipfs/${assetIPFSPath}`,
  prop('assetIPFSPath')
);

const buildArtworkImageUrl = curry(
  (options: AssetOptions, artwork: Artwork) => {
    return buildImgixIPFSUrl(artwork.assetIPFSPath, options);
  }
);

const buildArtworkVideoUrl = curry((options: AssetOptions, artwork: Artwork) =>
  cond([
    [
      hasSuccessfulStatusAndVideoAssetId,
      () => buildVideoAssetPlaybackUrl(options, artwork),
    ],
    [T, () => buildIPFSAssetUrl(artwork)],
  ])(artwork)
);

export const buildArtworkAssetUrl = curry(
  (options: AssetOptions, artwork: ArtworkAssetFields) =>
    cond([
      [isVideoMimeType, buildArtworkVideoUrl(options)],
      [isImageMimeType, buildArtworkImageUrl(options)],
      [isModelMimeType, buildArtworkModelUrl],
    ])(artwork)
);

export const buildAssetStaticImage = curry(
  (options: AssetOptions, artwork: ArtworkAssetFields) =>
    ifElse(
      isVideoMimeType,
      buildPosterUrl,
      buildArtworkImageUrl(options)
    )(artwork)
);

const cardAssetDefaults: AssetOptions = {
  q: 75,
  w: 960,
  'max-h': 960,
  fit: 'fill',
  auto: 'compress',
  quality: VideoAssetQuality.Preview,
};

export const buildArtworkCardAssetUrl = buildArtworkAssetUrl({
  ...cardAssetDefaults,
  fm: 'jpg',
});

export const buildArtworkCardDashboardUrl =
  buildArtworkAssetUrl(cardAssetDefaults);

export const buildArtworkPageAssetUrl = buildArtworkAssetUrl({
  q: 100,
  w: 1680,
  'max-h': 1680,
  fit: 'fill',
  auto: 'compress',
  quality: VideoAssetQuality.Max,
});

export const buildPageShareUrl = buildArtworkAssetUrl({
  q: 90,
  w: 1680,
  'max-h': 1680,
  fit: 'fill',
  fm: 'jpg',
  auto: 'compress',
  quality: VideoAssetQuality.Max,
});

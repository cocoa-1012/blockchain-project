const deploymentEnv = process.env.NEXT_PUBLIC_APP_ENV;

const VIDEO_ASSETS_STAGING = 'https://d2omfgxsr4njlw.cloudfront.net';
const VIDEO_ASSETS_PRODUCTION = 'https://assets.foundation.app';

export const videoAssetsHost =
  deploymentEnv === 'production'
    ? VIDEO_ASSETS_PRODUCTION
    : VIDEO_ASSETS_STAGING;

const MODEL_ASSETS_STAGING = 'https://dimycmcrx4tlw.cloudfront.net';
const MODEL_ASSETS_PRODUCTION = 'https://d1hiserqh6k9o1.cloudfront.net';

export const modelAssetsHost =
  deploymentEnv === 'production'
    ? MODEL_ASSETS_PRODUCTION
    : MODEL_ASSETS_STAGING;

const MODEL_IMAGE_ASSETS_STAGING = 'https://f8n-staging-3d-models.imgix.net';
const MODEL_IMAGE_ASSETS_PRODUCTION =
  'https://f8n-production-3d-models.imgix.net';

export const modelImageAssetsHost =
  deploymentEnv === 'production'
    ? MODEL_IMAGE_ASSETS_PRODUCTION
    : MODEL_IMAGE_ASSETS_STAGING;

const IMAGE_ASSETS_STAGING = 'https://f8n-ipfs-staging.imgix.net';
const IMAGE_ASSETS_PRODUCTION = 'https://f8n-ipfs-production.imgix.net';

export const imageAssetsHost =
  deploymentEnv === 'production'
    ? IMAGE_ASSETS_PRODUCTION
    : IMAGE_ASSETS_STAGING;

const APP_ASSETS_STAGING = 'https://f8n-staging.imgix.net';
const APP_ASSETS_PRODUCTION = 'https://f8n-production.imgix.net';

export const appAssetsHost =
  deploymentEnv === 'production' ? APP_ASSETS_PRODUCTION : APP_ASSETS_STAGING;

/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { includes } from 'ramda';
import { MutationFunction } from '@apollo/client';

import useGeneratePinataKey from 'hooks/queries/use-generate-pinata-key';
import useCreateArtwork from 'hooks/mutations/use-create-artwork';
import { useBatchServerArtworksByPublicKey } from 'hooks/queries/server/use-batch-server-artworks';
import useNavigationFlow from 'state/stores/navigation-flow';

import UploadArtworkView from 'components/uploads/artwork/UploadArtworkView';
import LoadingPage from 'components/LoadingPage';
import UploadArtworkError from './UploadArtworkError';
import { DuplicateUploadArtworkBlock } from 'components/transactions/TransactionBlock';

import { DUPLICATE_ASSET_ERROR_MSG, PINATA_FILE_ENDPOINT } from 'lib/constants';

import {
  buildS3BaseAssetUrl,
  createModelMimeType,
  getDimensionsFromFile,
  isModel,
} from 'utils/assets';
import { getMintedAssetIPFSPaths } from 'utils/artwork/artwork';
import { isEmptyOrNil } from 'utils/helpers';

interface UploadModelAssetsArgs {
  ipfsHash: string;
  modelPoster: Blob;
}

async function uploadModelAssets({
  ipfsHash,
  modelPoster,
}: UploadModelAssetsArgs) {
  const path = buildS3BaseAssetUrl(ipfsHash);

  const posterRes = await fetch('/api/sign-url', {
    method: 'POST',
    body: JSON.stringify({ path: `${path}/nft.png` }),
    headers: { 'content-type': 'application/json' },
  });
  const posterData = await posterRes.json();
  const posterSignedUrl = posterData.url;
  return fetch(posterSignedUrl, {
    method: 'PUT',
    body: modelPoster,
  });
}

interface PutArtworkInDBArgs {
  file: File;
  createArtwork: MutationFunction;
  ipfsHash: string;
  assetIPFSPaths: string[];
  skipDuplicateCheck: boolean;
}

async function putArtworkInDB({
  file,
  ipfsHash,
  createArtwork,
  assetIPFSPaths,
  skipDuplicateCheck,
}: PutArtworkInDBArgs): Promise<string> {
  const fileName = file.name;
  const fileDimensions = await getDimensionsFromFile(file);

  const assetIPFSPath = `${ipfsHash}/${fileName}`;

  // if the assetIPFSPath already exists in their artworks
  const isDuplicateAsset = includes(assetIPFSPath, assetIPFSPaths);

  // short-circuit the upload and throw an error
  if (isDuplicateAsset && !skipDuplicateCheck) {
    throw new Error(DUPLICATE_ASSET_ERROR_MSG);
  }

  const isTypeEmpty = isEmptyOrNil(file.type);
  const fallbackFormat = createModelMimeType(file.name);

  // Note: pinataUploadData returns just the hash even
  // when wrapping with directory, and the hash
  // is for the directory
  const createArtworkData = await createArtwork({
    variables: {
      data: {
        assetIPFSPath,
        mimeType: isTypeEmpty ? fallbackFormat : file.type,
        width: fileDimensions.width,
        height: fileDimensions.height,
        duration: fileDimensions.duration,
      },
    },
  });

  const artworkIdInDB = createArtworkData?.data?.createArtwork?.id;
  return artworkIdInDB;
}

interface PinataData {
  IpfsHash: string;
}
interface UploadArtworkContainerProps {
  token: string;
  resetTransaction: () => void;
  publicAddress: string;
}

export default function UploadArtworkContainer(
  props: UploadArtworkContainerProps
): JSX.Element {
  const { token, publicAddress, resetTransaction } = props;

  const router = useRouter();

  const setPercentCompleted = useNavigationFlow(
    (state) => state.setPercentCompleted
  );

  const { data: pinataApiKeyData, isLoading: isPinataLoading } =
    useGeneratePinataKey(token);

  const { data: serverArtworksData, loading: serverArtworksLoading } =
    useBatchServerArtworksByPublicKey({ publicKey: publicAddress });

  const [
    createArtwork,
    { loading: createArtworkLoading, error: createArtworkError },
  ] = useCreateArtwork(token);

  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [uploadError, setUploadError] = useState<AxiosError>(null);

  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const pinataJWT = pinataApiKeyData?.JWT;

  const userArtworks = serverArtworksData?.user?.artworks ?? [];
  const assetIPFSPaths = getMintedAssetIPFSPaths(userArtworks);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        // 1/6th of the progress
        setPercentCompleted(100 / 6);

        const formData = new FormData();
        formData.append('file', values.file);

        // https://pinata.cloud/documentation#PinFileToIPFS
        const pinataOptions = JSON.stringify({
          wrapWithDirectory: true,
        });
        formData.append('pinataOptions', pinataOptions);

        const formOptions: AxiosRequestConfig = {
          maxContentLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data`,
            Authorization: `Bearer ${pinataJWT}`,
          },
          onUploadProgress: (ev) => {
            const progressPercentage = (ev.loaded / ev.total) * 100;
            setProgressPercentage(progressPercentage);
          },
        };

        const internalPinataUploadData = await axios.post<PinataData>(
          PINATA_FILE_ENDPOINT,
          formData,
          formOptions
        );

        if (isModel(values.file.name)) {
          await uploadModelAssets({
            ipfsHash: internalPinataUploadData.data.IpfsHash,
            modelPoster: values.modelPoster,
          });
        }

        const artworkIdInDB = await putArtworkInDB({
          file: values.file,
          ipfsHash: internalPinataUploadData.data.IpfsHash,
          createArtwork,
          assetIPFSPaths,
          skipDuplicateCheck: false,
        });

        setIsRedirecting(true);

        router.push({
          pathname: `/creator/mint/${artworkIdInDB}`,
          query: { 'skip-check': true },
        });
      } catch (err) {
        setUploadError(err);
        throw err;
      }
    },
    [setPercentCompleted, createArtwork, assetIPFSPaths, pinataJWT, router]
  );

  // Keep showing loading state up until we redirect
  if (
    isPinataLoading ||
    serverArtworksLoading ||
    createArtworkLoading ||
    isRedirecting
  ) {
    return <LoadingPage />;
  }

  if (uploadError?.message === DUPLICATE_ASSET_ERROR_MSG) {
    return <DuplicateUploadArtworkBlock />;
  }

  if (uploadError || createArtworkError) {
    return <UploadArtworkError resetUpload={resetTransaction} />;
  }

  return (
    <UploadArtworkView
      onSubmit={handleSubmit}
      progressPercentage={progressPercentage}
      resetUpload={resetTransaction}
    />
  );
}

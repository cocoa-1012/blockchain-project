/* eslint-disable max-lines */
import { useRouter } from 'next/router';
import {
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import axios from 'axios';

import useNFTTransaction from 'hooks/web3/transactions/use-nft-transaction';
// Note: Used for the IFPS token metadata upload
import useGeneratePinataKey from 'hooks/queries/use-generate-pinata-key';
import useHasuraArtwork from 'hooks/queries/hasura/use-hasura-artwork';
import useUpdateArtwork, {
  useUpdateArtworkToMinting,
} from 'hooks/mutations/use-update-artwork';
import useArtworksByIPFSPathAndCreator from 'hooks/queries/hasura/use-artwork-by-ipfs-path-and-creator';
import useModal from 'hooks/use-modal';

import { getFirstValue, isEmptyOrNil, isValidTxHash } from 'utils/helpers';
import { isNonUserRejectedError } from 'utils/transactions';
import { getDuplicateMintedArtwork } from 'utils/artwork/artwork';

import { MethodEnum } from 'types/NFTMarketInterface';
import { MintFormValues } from 'components/transactions/mint/types';
import { ModalKey } from 'types/modal';
import { RevenueShare } from 'types/Share';
import Artwork from 'types/Artwork';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import LoadingPage from 'components/LoadingPage';

import MintForm from 'components/transactions/mint/MintForm';
import TransactionContainer, {
  TransactionFormContainer,
} from 'components/transactions/TransactionContainer';
import { TransactionError } from 'components/transactions/TransactionError';
import { DuplicateUploadArtworkBlock } from 'components/transactions/TransactionBlock';

import MintNFTDetailsInput from 'components/transactions/mint/MintNFTDetailsInput';
import MintTransactionSign from 'components/transactions/mint/MintTransactionSign';
import MintPreviewButton from 'components/transactions/mint/MintPreviewButton';
import MetaMaskError from 'components/auth/MetaMaskError';
import SplitDetails from 'components/transactions/split/SplitDetails';
import PreviousPageButton, {
  PreviousPageButtonAnchor,
} from 'components/navigation/PreviousPageButton';
import AlertUnsavedChanges from 'components/forms/AlertUnsavedChanges';
import TransactionSplitPane from 'components/transactions/TransactionSplitPane';
import ArtworkCardFormik from 'components/cards/artwork/ArtworkCardFormik';
import TransactionPane from 'components/transactions/TransactionPane';

import { PINATA_FILE_ENDPOINT, POLL_INTERVAL_VIDEO } from 'lib/constants';

const buildMetadata = (nameString: string, descriptionString: string) => {
  return {
    name: nameString,
    keyvalues: {
      description: descriptionString,
    },
  };
};

const buildData = ({
  fileContents,
  pinataOptions,
  metadataString,
}: {
  fileContents: string;
  pinataOptions: string;
  metadataString: string;
}) => {
  const data = new FormData();
  const mockFile = new File([fileContents], 'metadata.json', {
    type: 'application/json',
  });
  data.append('file', mockFile, 'metadata.json');
  data.append('pinataOptions', pinataOptions);
  data.append('pinataMetadata', metadataString);
  return data;
};

interface MintContainerProps {
  balance: number;
  authToken: string;
  publicAddress: string;
  isWrongNetwork: boolean;
  resetTransaction: () => void;
}

export default function MintContainer(props: MintContainerProps): JSX.Element {
  const {
    authToken: token,
    publicAddress,
    resetTransaction,
    isWrongNetwork,
  } = props;

  const [mimeType, setMimeType] = useState('image/jpeg');
  const [pinataError, setPinataError] = useState(null);
  const [isReadyToConfigureSplit, setIsReadyToConfigureSplit] = useState(false);

  const { data: pinataApiKeyData, isLoading: isPinataLoading } =
    useGeneratePinataKey(token);

  const pinataToken = pinataApiKeyData?.JWT;

  // Update artwork with metadata rather than creating it
  const [updateArtwork] = useUpdateArtwork(token);
  const [updateArtworkToMinting] = useUpdateArtworkToMinting(token);

  const { setCurrentModal } = useModal();

  const router = useRouter();
  const artworkId = getFirstValue(router.query.id);
  const skipDuplicateCheck = getFirstValue(router.query['skip-check']);

  // Poll for server artwork if it's a video
  // to get assetStatus to know whether to render
  // artwork with optimised Video asset or not
  // That logic is implemented in the artwork cards
  // themselves, though
  const {
    data: artworkData,
    loading: isServerArtworkLoading,
    refetch: refetchArtwork,
  } = useHasuraArtwork({
    id: artworkId,
    pollInterval: mimeType === 'video/mp4' ? POLL_INTERVAL_VIDEO : null,
  });

  useEffect(() => {
    refetchArtwork();
  }, [refetchArtwork]);

  const artwork = artworkData?.artwork;
  const mimeTypeFromArtwork = artwork?.mimeType;

  useEffect(() => {
    if (mimeTypeFromArtwork) {
      setMimeType(mimeTypeFromArtwork);
    }
  }, [mimeTypeFromArtwork]);

  const assetIPFSPath = artwork?.assetIPFSPath;

  const {
    data: artworksByIPFSAndCreatorData,
    loading: artworksByIPFSAndCreatorDataLoading,
  } = useArtworksByIPFSPathAndCreator({
    assetIPFSPath,
    publicKey: publicAddress,
  });

  const duplicateArtwork = getDuplicateMintedArtwork(
    artwork,
    artworksByIPFSAndCreatorData?.artworks ?? []
  );

  // TODO: Use different mint tx after first one with method of AdditionalMint
  const {
    sendMintTransaction,
    isSuccess: isVanillaMintSuccess,
    isLoading: isVanillaMintLoading,
    isProviderLoading,
    isError: isVanillaMintError,
    error: vanillaMintErorr,
  } = useNFTTransaction({ method: MethodEnum.FirstMint });

  const {
    sendMintWithSplitTransaction,
    isSuccess: isMintWithSplitSuccess,
    isLoading: isMintWithSplitLoading,
    isProviderLoading: isMintWithSplitProviderLoading,
    isError: isMintWithSplitError,
    error: mintWithSplitError,
  } = useNFTTransaction({ method: MethodEnum.MintWithSplit });

  const isMintSuccess = isVanillaMintSuccess || isMintWithSplitSuccess;
  const isLoading = isVanillaMintLoading || isMintWithSplitLoading;
  const isError = isVanillaMintError || isMintWithSplitError;

  const handleMintEthereumTx = useCallback(
    async ({
      ipfsCID,
      isSplitEnabled,
      shares,
    }: {
      ipfsCID: string;
      isSplitEnabled: boolean;
      shares?: RevenueShare[];
    }) => {
      if (isProviderLoading) {
        return setCurrentModal(ModalKey.AUTH_MAIN);
      }

      const ipfsPath = ipfsCID + '/metadata.json';

      const txHash = isSplitEnabled
        ? await sendMintWithSplitTransaction({
            tokenIPFSPath: ipfsPath,
            shares: shares,
          })
        : await sendMintTransaction({
            tokenIPFSPath: ipfsPath,
          });

      await updateArtworkToMinting({
        variables: {
          id: artworkId,
          mintTxHash: txHash,
        },
      });

      refetchArtwork();

      const hasValidTxHash = isValidTxHash(txHash);

      if (hasValidTxHash) {
        await router.push({
          pathname: `/creator/mint/${artworkId}/submitted`,
          query: { txHash },
        });
      }
      return txHash;
    },
    [
      isProviderLoading,
      sendMintTransaction,
      sendMintWithSplitTransaction,
      updateArtworkToMinting,
      setCurrentModal,
      artworkId,
      refetchArtwork,
      router,
    ]
  );

  // TODO: break this handler up into pieces
  const handleSubmit = useCallback(
    async (values: MintFormValues): Promise<void> => {
      const nameString = values.name;
      const descriptionString = values.description;
      const isDraft = values.isDraft;
      const downloadableUrlString = values.downloadableUrl;
      const shares = values.shares;
      const isUsingASplit = values.isUsingASplit;

      if (isDraft) {
        await updateArtwork({
          variables: {
            data: {
              id: artworkId,
              name: nameString,
              description: descriptionString,
              downloadableUrl: downloadableUrlString,
            },
          },
        });

        return; // return early
      }

      const metadata = buildMetadata(nameString, descriptionString);

      const content = {
        name: nameString,
        description: descriptionString,
        image: 'ipfs://' + assetIPFSPath,
      };

      const fileContents = JSON.stringify(content);
      const pinataOptions = JSON.stringify({
        wrapWithDirectory: true,
      });
      const metadataString = JSON.stringify(metadata);

      const data = buildData({ fileContents, pinataOptions, metadataString });

      let ipfsCID: string;

      try {
        const pinataUploadData = await axios.post(PINATA_FILE_ENDPOINT, data, {
          maxContentLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data;`,
            Authorization: `Bearer ${pinataToken}`,
          },
        });
        // Note: The returned data has does not include the path
        ipfsCID = pinataUploadData.data.IpfsHash;
      } catch (err) {
        setPinataError(err);
        // console.log('IPFS error');
        // console.error(err);
        throw err;
      }

      try {
        const noIpfsCID = isEmptyOrNil(ipfsCID);
        if (noIpfsCID) {
          throw new Error('IPFS cid is undefined');
        }
        await updateArtwork({
          variables: {
            data: {
              id: artworkId,
              metadataIPFSPath: ipfsCID + '/metadata.json',
              name: nameString,
              description: descriptionString,
              downloadableUrl: downloadableUrlString,
            },
          },
        });

        refetchArtwork();
      } catch (err) {
        // console.log('Server error');
        console.error(err);
        throw err;
      }

      try {
        if (isUsingASplit) {
          await handleMintEthereumTx({
            ipfsCID,
            isSplitEnabled: true,
            shares,
          });
        } else {
          await handleMintEthereumTx({ ipfsCID, isSplitEnabled: false });
        }
      } catch (err) {
        console.log('Ethereum tx error');
        console.error(err);
        throw err;
      }
    },
    [
      artworkId,
      pinataToken,
      assetIPFSPath,
      handleMintEthereumTx,
      updateArtwork,
      refetchArtwork,
      setPinataError,
    ]
  );

  if (
    isPinataLoading ||
    isServerArtworkLoading ||
    artworksByIPFSAndCreatorDataLoading
  ) {
    return <LoadingPage />;
  }

  if (isWrongNetwork) {
    return (
      <TransactionContainer artwork={artwork}>
        <MetaMaskError />
      </TransactionContainer>
    );
  }

  // TODO: Confirm this dismissing is working
  if (duplicateArtwork && !skipDuplicateCheck) {
    return <DuplicateUploadArtworkBlock />;
  }

  // Note: AND rather than or because of the negated logic
  const isNotUserRejectedError =
    isNonUserRejectedError(vanillaMintErorr) &&
    isNonUserRejectedError(mintWithSplitError);

  // TODO: When other errors are thrown like server
  // errors or Pinata errors, make sure we render an
  // error page too
  if ((isError && isNotUserRejectedError) || pinataError) {
    return (
      <TransactionContainer artwork={artwork}>
        <TransactionError
          error={vanillaMintErorr || pinataError}
          resetTransaction={resetTransaction}
        />
      </TransactionContainer>
    );
  }

  const isTxPending = isLoading || isMintSuccess;

  return (
    <>
      <Box css={{ display: isTxPending ? 'block' : 'none', margin: 'auto' }}>
        <MintTransactionSign artwork={artwork} publicAddress={publicAddress} />
      </Box>
      {/* the form stays mounted in-case the user
      rejects the tx keeps the state in-tact */}
      <Box css={{ display: isTxPending ? 'none' : 'block' }}>
        <MintForm
          onSubmit={handleSubmit}
          initialValues={{
            name: artwork?.name ?? '',
            description: artwork?.description ?? '',
            downloadableUrl: '',
            isUsingASplit: false,
            isDraft: false,
            shares: [
              {
                address: publicAddress,
                shareInPercentage: 100,
              },
            ],
          }}
        >
          <MintContainerCore
            artwork={artwork}
            publicAddress={publicAddress}
            setIsReadyToConfigureSplit={setIsReadyToConfigureSplit}
            isReadyToConfigureSplit={isReadyToConfigureSplit}
            isTxPending={isTxPending}
          />
        </MintForm>
      </Box>
    </>
  );
}

interface MintContainerCoreProps {
  artwork: Artwork;
  publicAddress: string;
  setIsReadyToConfigureSplit: Dispatch<SetStateAction<boolean>>;
  isReadyToConfigureSplit: boolean;
  isTxPending: boolean;
}

function MintContainerCore(props: MintContainerCoreProps): JSX.Element {
  const {
    artwork,
    publicAddress,
    isReadyToConfigureSplit,
    setIsReadyToConfigureSplit,
    isTxPending,
  } = props;

  return (
    <TransactionFormContainer>
      {isReadyToConfigureSplit && (
        <PreviousPageAction
          handleClick={() => setIsReadyToConfigureSplit(false)}
        />
      )}

      {!isTxPending && <AlertUnsavedChanges />}

      <TransactionSplitPane>
        <Box>
          <Grid css={{ gap: '$6' }}>
            <ArtworkCardFormik creator={artwork?.creator} artwork={artwork} />
            <MintPreviewButton />
          </Grid>
        </Box>

        <TransactionPane css={{ paddingX: '$9' }}>
          {isReadyToConfigureSplit ? (
            <SplitDetails publicAddress={publicAddress} />
          ) : (
            <MintNFTDetailsInput
              setIsReadyToConfigureSplit={setIsReadyToConfigureSplit}
              isReadyToConfigureSplit={isReadyToConfigureSplit}
            />
          )}
        </TransactionPane>
      </TransactionSplitPane>
    </TransactionFormContainer>
  );
}

interface PreviousPageActionProps {
  handleClick: () => void;
}

function PreviousPageAction(props: PreviousPageActionProps): JSX.Element {
  const { handleClick } = props;
  return (
    <PreviousPageButtonAnchor
      css={{
        display: 'none',
        '@bp4': {
          display: 'block',
        },
      }}
    >
      <PreviousPageButton onClick={handleClick} />
    </PreviousPageButtonAnchor>
  );
}

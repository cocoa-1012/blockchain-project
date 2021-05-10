/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading, Grid, ThemeUIStyleObject } from 'theme-ui';
import { Global, css } from '@emotion/react';
import { GetStaticPropsResult } from 'next';
import { useLocalStorage } from 'react-use';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import Body from 'components/Body';
import Page from 'components/Page';
import LoadingPage from 'components/LoadingPage';
import CreateMediaOption from 'components/dashboard/CreateMediaOption';
import InviteOnlyOverlay from 'components/dashboard/InviteOnlyOverlay';
import renderTransactionWarningBlock from 'components/trust-safety/TransactionWarningBlock';
import MobileNotSupportedModal from 'components/modals/MobileNotSupportedModal';

import CreateImageIcon from 'assets/icons/create-image-icon.svg';
import CreateVideoIcon from 'assets/icons/create-video-icon.svg';
import CreateAudioIcon from 'assets/icons/create-audio-icon.svg';
import Create3DIcon from 'assets/icons/create-3d-icon.svg';

import MediaOption from 'types/MediaType';
import ModerationStatus from 'types/ModerationStatus';

import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useUserModerationState from 'hooks/queries/hasura/use-user-moderation-state';
import useBodyClass from 'hooks/use-body-class';
import useUnsupportedFlow from 'hooks/use-unsupported-flow';

import {
  getWaitlistTotalCount,
  WaitlistTotalCountResponse,
} from 'queries/hasura/waitlist';

import { getFirstValue } from 'utils/helpers';

export interface CreateProps {
  waitlistCount: WaitlistTotalCountResponse;
}

export default function MediaType(props: CreateProps): JSX.Element {
  const { waitlistCount } = props;

  const router = useRouter();

  useUnsupportedFlow();

  const sx = getStyles();

  useBodyClass('creator-flow');

  const { user } = useAuthToken();

  const publicAddress = user?.publicAddress;

  const { data: userData, isLoading: userIsLoading } = useUserByPublicKey({
    publicKey: publicAddress,
  });

  const hasSplitsQueryParam = getFirstValue(router.query['splits-enabled']);

  const [, setSplitsEnabled] = useLocalStorage('splits-enabled');

  useEffect(() => {
    if (hasSplitsQueryParam) {
      setSplitsEnabled(true);
    }
  }, [hasSplitsQueryParam, setSplitsEnabled]);

  const {
    isUserModerated,
    isLoading: isModerationStatusLoading,
    moderationStatus,
  } = useUserModerationState(publicAddress);

  const serverUser = userData?.user;

  const isApprovedCreator = serverUser?.isApprovedCreator;

  const isApproved = isApprovedCreator && !isUserModerated;

  const isLoading = userIsLoading || isModerationStatusLoading;

  if (isUserModerated && moderationStatus === ModerationStatus.UnderReview) {
    return (
      <Page title="Under Review">
        {renderTransactionWarningBlock(moderationStatus)}
      </Page>
    );
  }

  if (isUserModerated && moderationStatus === ModerationStatus.Suspended) {
    return (
      <Page title="Permanently Removed">
        {renderTransactionWarningBlock(moderationStatus)}
      </Page>
    );
  }

  return (
    <>
      <Global
        styles={css`
          body {
            background-color: #f2f2f2;
          }
        `}
      />
      <MobileNotSupportedModal />
      <Page title="Create an NFT" footerStyle={{ zIndex: 4 }}>
        <Body sx={sx.page}>
          {isLoading ? (
            <LoadingPage sx={sx.loading} />
          ) : (
            <InviteOnlyOverlay
              enabled={!isApproved}
              waitlistCount={waitlistCount}
            >
              <>
                <Heading variant="h.l" sx={sx.heading}>
                  Create an NFT
                </Heading>
                <Grid gap="xl">
                  <Grid
                    sx={{ pointerEvents: isApproved ? 'all' : 'none' }}
                    columns={options.length}
                    gap={20}
                  >
                    {options.map((option, key) => (
                      <CreateMediaOption option={option} key={key} />
                    ))}
                  </Grid>
                </Grid>
              </>
            </InviteOnlyOverlay>
          )}
        </Body>
      </Page>
    </>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<CreateProps>
> {
  // TODO: Potentially don't fetch this unless we'll need it,
  // since this page is used when users go to create
  const waitlistCount = await getWaitlistTotalCount();

  return {
    props: { waitlistCount },
    revalidate: 30,
  };
}

const options: MediaOption[] = [
  {
    mediaTitle: 'Image',
    mediaLabel: 'JPG or PNG',
    icon: <CreateImageIcon />,
    href: '/creator/upload',
  },
  {
    mediaTitle: 'Video',
    mediaLabel: 'MP4',
    icon: <CreateVideoIcon />,
    href: '/creator/upload',
  },
  {
    mediaTitle: '3D',
    mediaLabel: 'GLTF or GLB',
    icon: <Create3DIcon />,
    href: '/creator/upload',
    newOption: true,
  },
  {
    mediaTitle: 'Audio',
    mediaLabel: 'MP3, FLAC or WAV',
    icon: <CreateAudioIcon />,
    href: '/creator/upload',
    comingSoon: true,
  },
];

const getStyles = () => {
  const heading: ThemeUIStyleObject = {
    marginBottom: 'xl',
    textAlign: 'center',
  };

  const page: ThemeUIStyleObject = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    maxWidth: 1280,
    marginX: 'auto',
  };

  const button: ThemeUIStyleObject = {
    borderColor: 'black.10',
    fontSize: 'xs',
    '@media (hover: hover)': {
      '&:hover': {
        borderColor: 'black.100',
      },
    },
  };

  const loading: ThemeUIStyleObject = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 999,
    transform: 'translate(-50%, -50%)',
    padding: 0,
  };

  return { page, heading, button, loading };
};

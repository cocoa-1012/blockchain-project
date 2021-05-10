/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { Box, Button, jsx, Grid, Flex } from 'theme-ui';
import { useMutation } from 'react-query';
import { useCallback } from 'react';

import useResetWaitlistCaches from 'hooks/queries/hasura/use-reset-waitlist-caches';
import useModal from 'hooks/use-modal';

import { setWaitlistJoin } from 'queries/hasura/waitlist';

import { ModalKey } from 'types/modal';
import { textAlignCenter } from 'types/styles';

import Link from 'components/links/Link';

export interface JoinButtonProps {
  isLoggedIn: boolean;
  isVerified: boolean;
  token: string;
  isOnWaitlist: boolean;
  isApprovedCreator: boolean;
}

function JoinButton(props: JoinButtonProps) {
  const {
    isLoggedIn,
    isVerified,
    token,
    isOnWaitlist,
    isApprovedCreator,
  } = props;

  const { setCurrentModal } = useModal();

  const openModal = useCallback(() => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  }, [setCurrentModal]);

  const invalidateQueries = useResetWaitlistCaches();

  const { mutate: joinWaitlist, isLoading } = useMutation(
    () => setWaitlistJoin(token),
    { onSuccess: invalidateQueries }
  );

  // if isOnwaitlist then dont show button
  if (isOnWaitlist || isApprovedCreator) {
    return null;
  }

  // If logged in and verified add to waitlist
  if (isLoggedIn && isVerified) {
    return (
      <Button
        disabled={isLoading}
        sx={sx.joinCTA}
        onClick={() => joinWaitlist()}
      >
        {isLoading ? `Joining Community Upvote…` : `Join Community Upvote`}
      </Button>
    );
  }

  // if logged in but not verified prompt verification flow
  if (isLoggedIn && !isVerified) {
    return (
      <Link
        href={{
          pathname: '/profile/verify',
          query: { 'redirect-path': '/upvote' },
        }}
      >
        <a sx={{ textDecoration: 'none', display: 'block' }}>
          <Button sx={sx.joinCTA}>Verify profile to join</Button>
        </a>
      </Link>
    );
  }

  // if not logged in and not verified open auth modal
  return (
    <Button sx={sx.joinCTA} onClick={openModal}>
      Join Community Upvote
    </Button>
  );
}

export interface JoinWaitlistProps {
  isLoading: boolean;
  isLoggedIn: boolean;
  isVerified: boolean;
  token: string;
  isOnWaitlist: boolean;
  isApprovedCreator: boolean;
}

export default function JoinWaitlist(props: JoinWaitlistProps): JSX.Element {
  const {
    isLoggedIn,
    isVerified,
    isOnWaitlist,
    token,
    isLoading,
    isApprovedCreator,
  } = props;

  return (
    <>
      <Grid sx={sx.headingWrapper}>
        <Box sx={sx.headingIntro}>
          {!isLoading && (
            <Flex>
              <JoinButton
                isOnWaitlist={isOnWaitlist}
                isLoggedIn={isLoggedIn}
                isVerified={isVerified}
                isApprovedCreator={isApprovedCreator}
                token={token}
              />
            </Flex>
          )}
        </Box>
      </Grid>
    </>
  );
}

const sx = {
  headingWrapper: {
    display: 'grid',
    gap: ['l', 'xl', 'xl', 'xxl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingIntro: {
    borderRight: '1px solid',
    borderRightColor: 'black.20',
  },
  joinCTA: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 260,
    textAlign: textAlignCenter,
    justifyContent: 'center',
  },
};

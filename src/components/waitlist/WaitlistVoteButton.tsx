/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { Box, Button, Flex, Grid, jsx } from 'theme-ui';
import { useMutation } from 'react-query';
import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import UpArrow from 'assets/icons/up-arrow.svg';

import { flexDirectionForPrefix } from 'types/styles';

import useResetWaitlistCaches from 'hooks/queries/hasura/use-reset-waitlist-caches';
import useModal from 'hooks/use-modal';

import SpinnerStroked from 'components/SpinnerStroked';
import GraySquare from 'components/GraySquare';

import { ModalKey } from 'types/modal';
import {
  setWaitlistAddVote,
  setWaitlistRemoveVote,
} from 'queries/hasura/waitlist';

export interface WaitlistVoteButtonProps {
  hasNoVotes: boolean;
  isLoggedIn: boolean;
  isVerified: boolean;
  token: string;
  publicAddress: string;
  currentUserHasVoted: boolean;
  isLoading: boolean;
}

export default function WaitlistVoteButton(
  props: WaitlistVoteButtonProps
): JSX.Element {
  const {
    hasNoVotes,
    isLoggedIn,
    isVerified,
    token,
    publicAddress,
    currentUserHasVoted,
    isLoading,
  } = props;

  const router = useRouter();

  const [optUserHasVoted, setOptUserHasVoted] = useState<boolean>(
    currentUserHasVoted
  );

  const { setCurrentModal } = useModal();

  const openModal = useCallback(() => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  }, [setCurrentModal]);

  const invalidateQueries = useResetWaitlistCaches();

  const { mutate: addVote, isLoading: isAddVoteLoading } = useMutation(
    () => setWaitlistAddVote({ token, publicKey: publicAddress }),
    { onSettled: invalidateQueries }
  );

  const {
    mutate: removeVote,
    isLoading: isRemoteVoteLoading,
  } = useMutation(
    () => setWaitlistRemoveVote({ token, publicKey: publicAddress }),
    { onSettled: invalidateQueries }
  );

  const isMutationLoading = isAddVoteLoading || isRemoteVoteLoading;

  const handleVoteClick = useCallback(() => {
    if (!isLoggedIn) {
      return openModal();
    }

    if (!isVerified) {
      return router.push({
        pathname: '/profile/verify',
        query: { 'redirect-path': router.asPath },
      });
    }

    if (currentUserHasVoted) {
      setOptUserHasVoted(false);
      return removeVote();
    }

    if (hasNoVotes) {
      return;
    }
    setOptUserHasVoted(true);
    addVote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addVote,
    removeVote,
    hasNoVotes,
    isLoggedIn,
    isVerified,
    openModal,
    currentUserHasVoted,
    // router,
  ]);

  // Handle changes from parent component to update local optimistic state
  useEffect(() => {
    setOptUserHasVoted(currentUserHasVoted);
  }, [currentUserHasVoted]);

  if (isLoading) {
    return <WaitlistVoteButtonSkeleton />;
  }

  return (
    <Box sx={sx.voteButtonWrapper}>
      <Button
        variant="blank"
        sx={{
          ...sx.voteButton,
          ...(optUserHasVoted && !isMutationLoading && sx.voteButtonVoted),
          ...(hasNoVotes &&
            !isMutationLoading &&
            !optUserHasVoted &&
            sx.voteButtonDisabled),
        }}
        style={{ pointerEvents: isMutationLoading ? 'none' : 'all' }}
        onClick={handleVoteClick}
      >
        <Flex
          sx={{
            minWidth: 20,
            minHeight: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isMutationLoading ? (
            <SpinnerStroked size={20} />
          ) : (
            <UpArrow
              sx={{
                display: 'block',
                color: optUserHasVoted ? 'white.100' : 'black.100',
                ...(hasNoVotes &&
                  !isMutationLoading &&
                  !optUserHasVoted &&
                  sx.voteButtonDisabledArrow),
              }}
              width={14}
              height={20}
            />
          )}
        </Flex>
      </Button>
    </Box>
  );
}

export function WaitlistVoteButtonSkeleton(): JSX.Element {
  return (
    <Grid gap="xs" sx={{ justifyContent: 'center' }}>
      <GraySquare width={60} height={60} />
      <GraySquare width={24} height={22} sx={{ marginX: 'auto' }} />
    </Grid>
  );
}

const sx = {
  voteButtonWrapper: {
    display: 'flex',
    flexDirection: flexDirectionForPrefix,
    alignItems: 'center',
    flexShrink: 0,
  },
  voteButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 10,
    border: '2px solid',
    borderColor: 'black.10',
    backgroundColor: 'white.100',
    px: [0, 0, 0],
    py: ['xs', null, 0],

    '&:hover': {
      backgroundColor: 'black.5',
      borderColor: 'black.10',
      boxShadow: 's',
    },
  },
  voteButtonVoted: {
    borderColor: 'black.100',
    backgroundColor: 'black.100',
    '&:hover': {
      backgroundColor: 'black.100',
      borderColor: 'black.100',
    },
  },
  voteButtonDisabled: {
    borderColor: 'black.10',
    cursor: 'not-allowed',
    '&:hover': {
      boxShadow: 'none',
      borderColor: 'black.10',
      transform: 'none',
    },
  },
  voteButtonDisabledArrow: { color: 'black.10' },
};

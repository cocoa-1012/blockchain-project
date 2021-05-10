import Account, { AccountExtended } from 'types/Account';
import { WaitlistRankedUser } from 'types/Waitlist';
import WaitlistVote from 'types/WaitlistVote';

import { getFirstValue } from './helpers';
import { getUserVoteCount, hasUserVoted } from './users';

interface WaitlistRankInfoArgs {
  waitlistUserData: {
    rankedWaitlistUser: WaitlistRankedUser;
  };
}

interface WaitlistRankInfo {
  waitlistRank: number;
}

export function getWaitlistRankInfo({
  waitlistUserData,
}: WaitlistRankInfoArgs): WaitlistRankInfo {
  const waitlistRankedUser: WaitlistRankedUser = getFirstValue(
    waitlistUserData?.rankedWaitlistUser
  );

  const waitlistRank = waitlistRankedUser?.rankNumber;

  return {
    waitlistRank,
  };
}

interface WaitlistVoteInfoArgs {
  currentUser: Account;
  user: Account;
  usedVotesData: {
    waitlistVotes: WaitlistVote[];
  };
}

interface WaitlistVoteInfo {
  currentUserHasVoted: boolean;
  hasNoVotes: boolean;
  usedVotes: WaitlistVote[];
  flattenedVotes: AccountExtended[];
  usedVotesCount: number;
  remainingVotesCount: number;
}

export function getWaitlistVoteInfo({
  usedVotesData,
  currentUser,
  user,
}: WaitlistVoteInfoArgs): WaitlistVoteInfo {
  const usedVotes = usedVotesData?.waitlistVotes ?? [];
  const usedVotesCount = usedVotes.length;

  const flattenedVotedForUsers = usedVotes.map((vote) => vote.userVoteFor);

  const remainingVotes = getUserVoteCount(currentUser, usedVotesCount);

  return {
    currentUserHasVoted: hasUserVoted(user, usedVotes),
    hasNoVotes: remainingVotes === 0,
    usedVotes,
    flattenedVotes: flattenedVotedForUsers,
    usedVotesCount,
    remainingVotesCount: remainingVotes,
  };
}

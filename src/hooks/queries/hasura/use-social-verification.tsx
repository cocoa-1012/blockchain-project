import { useQuery, QueryResult, QueryHookOptions } from '@apollo/client';

import {
  GET_HASURA_SOCIAL_VERIFICATIONS_INSTAGRAM_BY_PUBLIC_KEY,
  GET_HASURA_SOCIAL_VERIFICATIONS_TWITTER_BY_PUBLIC_KEY,
  GET_HASURA_VALID_SOCIAL_VERIFICATIONS_INSTAGRAM_BY_PUBLIC_KEY,
  GET_HASURA_VALID_SOCIAL_VERIFICATIONS_TWITTER_BY_USERNAME,
  GET_HASURA_VALID_SOCIAL_VERIFICATIONS_TWITTER_BY_PUBLIC_KEY,
} from 'queries/hasura/socialVerification';

import SocialVerification from 'types/SocialVerification';

import { maybeGetAddress } from 'utils/users';

interface SocialVerificationData {
  socialVerifications: SocialVerification[];
}

interface SocialVerificationArgs extends QueryHookOptions {
  publicKey: string;
  skip?: boolean;
}

interface SocialVerificationByUsernameArgs extends QueryHookOptions {
  username: string;
  skip?: boolean;
}

export default function useSocialVerificationTwitter({
  publicKey,
  pollInterval,
  skip,
}: SocialVerificationArgs): QueryResult<SocialVerificationData> {
  return useQuery<SocialVerificationData, SocialVerificationArgs>(
    GET_HASURA_SOCIAL_VERIFICATIONS_TWITTER_BY_PUBLIC_KEY,
    {
      variables: { publicKey: maybeGetAddress(publicKey) },
      skip: !publicKey || skip,
      context: { endpoint: 'hasura' },
      pollInterval,
    }
  );
}

export function useSocialVerificationInstagram({
  publicKey,
  pollInterval,
  skip,
}: SocialVerificationArgs): QueryResult<SocialVerificationData> {
  return useQuery<SocialVerificationData, SocialVerificationArgs>(
    GET_HASURA_SOCIAL_VERIFICATIONS_INSTAGRAM_BY_PUBLIC_KEY,
    {
      variables: { publicKey: maybeGetAddress(publicKey) },
      skip: !publicKey || skip,
      context: { endpoint: 'hasura' },
      pollInterval,
    }
  );
}

export function useValidSocialVerificationInstagram({
  publicKey,
  pollInterval,
  skip,
}: SocialVerificationArgs): QueryResult<SocialVerificationData> {
  return useQuery<SocialVerificationData, SocialVerificationArgs>(
    GET_HASURA_VALID_SOCIAL_VERIFICATIONS_INSTAGRAM_BY_PUBLIC_KEY,
    {
      variables: { publicKey: maybeGetAddress(publicKey) },
      skip: !publicKey || skip,
      context: { endpoint: 'hasura' },
      pollInterval,
    }
  );
}

export function useValidSocialVerificationTwitter({
  publicKey,
  pollInterval,
  skip,
}: SocialVerificationArgs): QueryResult<SocialVerificationData> {
  return useQuery<SocialVerificationData, SocialVerificationArgs>(
    GET_HASURA_VALID_SOCIAL_VERIFICATIONS_TWITTER_BY_PUBLIC_KEY,
    {
      variables: { publicKey: maybeGetAddress(publicKey) },
      skip: !publicKey || skip,
      context: { endpoint: 'hasura' },
      pollInterval,
    }
  );
}

export function useValidSocialVerificationTwitterByTwitterUsername({
  username,
  pollInterval,
  skip,
}: SocialVerificationByUsernameArgs): QueryResult<SocialVerificationData> {
  return useQuery<SocialVerificationData, SocialVerificationByUsernameArgs>(
    GET_HASURA_VALID_SOCIAL_VERIFICATIONS_TWITTER_BY_USERNAME,
    {
      variables: { username: username },
      skip: !username || skip,
      context: { endpoint: 'hasura' },
      pollInterval,
    }
  );
}

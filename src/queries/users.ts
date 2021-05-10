import { gql } from '@apollo/client';
import { getAddress } from '@ethersproject/address';

import { fndServerClient } from 'lib/clients/graphql';

import { UserFragment } from 'queries/server/server-fragments';
import { REDEEM_INVITE } from './server/mutations/redeemInvite';

import Account from 'types/Account';
import InviteCode from 'types/InviteCode';

const GET_USER_WITH_EMAIL_BY_PUBLIC_KEY = gql`
  query getUserWithEmailByKey($publicKey: String!) {
    user(publicKey: $publicKey) {
      ...UserFragment
      email
    }
  }
  ${UserFragment}
`;

const GET_USER_EMAIL_BY_PUBLIC_KEY = gql`
  query getUserEmailByKey($publicKey: String!) {
    user(publicKey: $publicKey) {
      email
    }
  }
`;

export async function getUserEmailByPublicKey(
  publicKey: string,
  token: string
): Promise<{ user: Account }> {
  const client = fndServerClient(token);
  return await client.request(GET_USER_EMAIL_BY_PUBLIC_KEY, {
    publicKey: getAddress(publicKey),
  });
}

export async function getUserWithEmailByPublicKey(
  publicKey: string,
  token: string
): Promise<{ user: Account }> {
  const client = fndServerClient(token);
  return await client.request(GET_USER_WITH_EMAIL_BY_PUBLIC_KEY, {
    publicKey: getAddress(publicKey),
  });
}

const UPSERT_USER = gql`
  mutation upsertUser($data: UserInput!) {
    upsertUser(data: $data) {
      ...UserFragment
      email
    }
  }
  ${UserFragment}
`;
export interface UpsertUserVariables {
  token: string;
  data: Account;
}

export async function upsertUser({
  data,
  token,
}: UpsertUserVariables): Promise<{ upsertUser: Account }> {
  const client = fndServerClient(token);
  return await client.request(UPSERT_USER, {
    data,
  });
}

const APPROVE_AS_CREATOR = gql`
  mutation approveAsCreator($data: ApproveUserInput!) {
    approveUserAsCreator(data: $data) {
      ...UserFragment
      email
    }
  }
  ${UserFragment}
`;

interface ApproveAsCreatorArgs {
  data: any;
  token: string;
}

interface RedeemInviteArgs {
  inviteCode: string;
  token: string;
}

export async function approveAsCreator({
  data,
  token,
}: ApproveAsCreatorArgs): Promise<{ approveAsCreator: Account }> {
  const client = fndServerClient(token);
  return await client.request(APPROVE_AS_CREATOR, {
    data,
  });
}

// TODO: Decide whether to use this one or the Apollo version in
// queries/server/mutations
// Note: No reason to enforce use of a token here
export async function redeemInvite({
  inviteCode,
  token,
}: RedeemInviteArgs): Promise<{ redeemInvite: InviteCode }> {
  if (!inviteCode) {
    throw new Error('No invite code provided');
  }
  const client = fndServerClient(token);
  return await client.request(REDEEM_INVITE, {
    inviteCode,
  });
}

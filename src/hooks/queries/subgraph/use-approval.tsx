import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';
import { gql } from '@apollo/client';
import { ClientError } from 'graphql-request';

import { maybeLowerCase } from 'utils/case';

import { fndGraphClient } from 'lib/clients/graphql';

import { QueryCacheKey } from 'types/Queries';
import Account from 'types/Account';

import { getNFT721Address, getNFTMarketAddress } from 'lib/addresses';

const nftMarketAddr = getNFTMarketAddress();
const nft721Addr = getNFT721Address();

console.log({ nftMarketAddr, nft721Addr });

const APPROVAL_QUERY = gql`
  query getApproval(
    $publicKey: String!
    $nftContract: String!
    $nftMarketContract: String!
  ) {
    account(id: $publicKey) {
      nftAccountApprovals(
        where: { nftContract: $nftContract, spender: $nftMarketContract }
      ) {
        id
      }
    }
  }
`;

export interface ApprovalData {
  account: Account;
}

interface ApprovalArgs extends ApprovalHookArgs {
  nftContract: string;
  nftMarketContract: string;
}

interface ApprovalHookArgs
  extends UseQueryOptions<ApprovalData, ClientError, ApprovalData> {
  publicKey: string;
}

export async function getApproval(publicKey: string): Promise<ApprovalData> {
  const client = fndGraphClient();
  return client.request<ApprovalData, ApprovalArgs>(APPROVAL_QUERY, {
    publicKey: maybeLowerCase(publicKey),
    nftContract: maybeLowerCase(nft721Addr),
    nftMarketContract: maybeLowerCase(nftMarketAddr),
  });
}

export default function useApproval({
  publicKey,
  enabled = true,
  refetchOnWindowFocus = false,
}: ApprovalHookArgs): UseQueryResult<ApprovalData, ClientError> {
  return useQuery(
    [QueryCacheKey.GraphApproval, { publicKey }],
    () => getApproval(publicKey),
    {
      enabled: Boolean(publicKey && enabled),
      refetchOnWindowFocus,
    }
  );
}

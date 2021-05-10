import { gql } from '@apollo/client';

import { fndHasuraClient } from 'lib/clients/graphql';

import { maybeGetAddress, maybeGetAddressOrEmpty } from 'utils/users';

import { HasuraUserFragmentLight } from 'queries/hasura/hasura-fragments';

import { Collector } from 'types/Account';

const PROFILE_COLLECTORS_QUERY = gql`
  query ProfileCollectorsQuery(
    $publicKey: String!
    $currentUserPublicKey: String!
    $limit: Int!
    $offset: Int!
  ) {
    collectors: user(
      offset: $offset
      limit: $limit
      where: {
        publicKey: { _neq: $publicKey }
        highestBidAuctions: {
          status: { _in: ["FINALIZED", "ENDED"] }
          artwork: {
            status: { _eq: "MINTED" }
            moderationStatus: { _eq: "ACTIVE" }
            publicKey: { _eq: $publicKey }
          }
        }
      }
    ) {
      ...HasuraUserFragmentLight
      follows(
        where: {
          user: { _eq: $currentUserPublicKey }
          isFollowing: { _eq: true }
        }
      ) {
        createdAt
        isFollowing
      }
      highestBidAuctions(
        limit: 1
        order_by: { endsAt: desc }
        where: {
          status: { _in: ["FINALIZED", "ENDED"] }
          artwork: {
            status: { _eq: "MINTED" }
            moderationStatus: { _eq: "ACTIVE" }
            publicKey: { _eq: $publicKey }
          }
        }
      ) {
        endsAt
      }
      highestBidAuctions_aggregate(
        where: {
          status: { _in: ["FINALIZED", "ENDED"] }
          artwork: {
            status: { _eq: "MINTED" }
            moderationStatus: { _eq: "ACTIVE" }
            publicKey: { _eq: $publicKey }
          }
        }
      ) {
        aggregate {
          count
        }
      }
    }
  }
  ${HasuraUserFragmentLight}
`;

export interface ProfileCollectorQueryData {
  collectors: Collector[];
}

interface ProfileCollectorQueryArgs {
  publicKey: string;
  currentUserPublicKey: string;
  limit: number;
  offset: number;
}

export async function getProfileCollectors({
  publicKey,
  currentUserPublicKey,
  limit,
  offset,
}: ProfileCollectorQueryArgs): Promise<Collector[]> {
  const client = fndHasuraClient();

  const { collectors } = await client.request<
    ProfileCollectorQueryData,
    ProfileCollectorQueryArgs
  >(PROFILE_COLLECTORS_QUERY, {
    publicKey: maybeGetAddress(publicKey),
    currentUserPublicKey: maybeGetAddressOrEmpty(currentUserPublicKey),
    limit,
    offset,
  });

  return collectors;
}

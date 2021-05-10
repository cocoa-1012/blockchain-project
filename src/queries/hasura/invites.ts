import { gql } from '@apollo/client';

export const GET_HASURA_USER_INVITE_COUNT = gql`
  query getUserUserInviteCount($publicKey: String!) {
    inviteCount: invite_code_aggregate(
      where: { senderPublicKey: { _eq: $publicKey } }
    ) {
      aggregate {
        count
      }
    }
    inviteRemainingCount: invite_code_aggregate(
      where: {
        senderPublicKey: { _eq: $publicKey }
        redeemedAt: { _is_null: true }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

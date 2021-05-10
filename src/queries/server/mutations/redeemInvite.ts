import { gql } from '@apollo/client';

// Note: Only use this Apollo version in components via the hook
export const REDEEM_INVITE = gql`
  mutation redeemInviteCode($inviteCode: String!) {
    redeemInviteCode(inviteCode: $inviteCode) {
      redeemedAt
      inviteCode
    }
  }
`;

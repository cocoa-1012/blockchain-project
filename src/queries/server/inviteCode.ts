import { gql } from '@apollo/client';
import { InviteCodeFragment } from './server-fragments';

export const GET_INVITE_CODE = gql`
  query inviteCode($inviteCode: String!) {
    inviteCode(inviteCode: $inviteCode) {
      ...InviteCodeFragment
    }
  }
  ${InviteCodeFragment}
`;

export const GET_INVITE_CODES = gql`
  query myInviteCodes {
    myInviteCodes {
      ...InviteCodeFragment
    }
  }
  ${InviteCodeFragment}
`;

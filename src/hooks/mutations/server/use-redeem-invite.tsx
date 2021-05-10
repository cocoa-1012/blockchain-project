import { useMutation, MutationTuple } from '@apollo/client';

import { REDEEM_INVITE } from 'queries/server/mutations/redeemInvite';
import InviteCode from 'types/InviteCode';

export interface RedeemInviteData {
  inviteCode: InviteCode;
}

interface RedeemInviteArgs {
  inviteCode: string;
}

export default function useRedeemInvite(
  inviteCode: string,
  token: string
): MutationTuple<RedeemInviteData, RedeemInviteArgs> {
  return useMutation<RedeemInviteData, RedeemInviteArgs>(REDEEM_INVITE, {
    variables: { inviteCode },
    context: { endpoint: 'server', token },
  });
}

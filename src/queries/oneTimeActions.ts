/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { gql } from '@apollo/client';
import { getAddress } from '@ethersproject/address';

import { fndHasuraClient, fndServerClient } from 'lib/clients/graphql';
import { ActionType } from 'types/ActionType';

export const HASURA_USER_ONE_TIME_ACTIONS = gql`
  query hasuraUserOneTimeActions($publicKey: String!, $actionType: String!) {
    oneTimeActions: one_time_action(
      where: {
        publicKey: { _eq: $publicKey }
        actionType: { _eq: $actionType }
      }
    ) {
      createdAt
    }
  }
`;

interface UserOneTimeActions {
  oneTimeActions: { createdAt: string }[];
}

interface UserOneTimeActionsArgs {
  publicKey: string;
  actionType: ActionType;
}

export async function getUserOneTimeActions({
  publicKey,
  actionType,
}: UserOneTimeActionsArgs): Promise<UserOneTimeActions> {
  const client = fndHasuraClient();
  return await client.request<UserOneTimeActions>(
    HASURA_USER_ONE_TIME_ACTIONS,
    {
      publicKey: getAddress(publicKey),
      actionType,
    }
  );
}

interface SetUserOneTimeAction {
  recordOneTimeAction: { createdAt: string }[];
}

interface SetUserOneTimeActionArgs {
  token: string;
  actionType: ActionType;
}

export const HASURA_SET_ONE_TIME_ACTION = gql`
  mutation setOneTimeAction($actionType: String!) {
    recordOneTimeAction(actionType: $actionType) {
      createdAt
    }
  }
`;

export async function setUserOneTimeAction({
  token,
  actionType,
}: SetUserOneTimeActionArgs): Promise<SetUserOneTimeAction> {
  const client = fndServerClient(token);
  return await client.request<SetUserOneTimeAction>(
    HASURA_SET_ONE_TIME_ACTION,
    {
      actionType,
    }
  );
}

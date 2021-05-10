/* eslint-disable max-lines */
import Iron from '@hapi/iron';
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize, parse } from 'cookie';
import { JsonRpcProvider } from '@ethersproject/providers';
import { hexStripZeros, hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { verifyMessage } from '@ethersproject/wallet';

import { includes } from 'ramda';
import Sentry from 'lib/clients/sentry';
import { useLocalStorage } from 'react-use';
import { useQueryClient } from 'react-query';

import { upsertUser } from 'queries/users';
import { getHasuraUserByPublicKey } from 'queries/hasura/users';

import useLastConnector from 'hooks/web3/use-last-connector';

import { sgIdentify } from 'lib/clients/analytics';

import Account from 'types/Account';
import WalletUser from 'types/WalletUser';
import { WalletProvider, WalletState } from 'types/Wallet';
import { QueryCacheKey } from 'types/Queries';

import { getError } from './helpers';

import useWalletState from 'state/stores/wallet';

interface NewUserRes {
  success: boolean;
  user?: Account;
  error?: string;
}

async function handleNewUserRes(res: Response): Promise<NewUserRes> {
  const success = res.ok;
  if (!success) {
    const err = await res.text();
    Sentry.captureMessage(err);
    const success = res.ok;
    return { success, error: err };
  }
  const { user } = await res.json();

  return { success, user };
}

async function sendAnalyticsAndRedirect({ onAuthenticated, user }) {
  sgIdentify({
    userId: user.publicAddress,
    traits: {
      email: user.email,
      publicAddress: user.publicAddress,
      provider: 'ExternalWallet',
    },
  });

  // Note: This doesn't have much logic in it - it just sends the user to another page
  await onAuthenticated(user);
}

const TOKEN_SECRET = process.env.IRON_SECRET;
const TOKEN_NAME = 'f8n_token';
// 15 days
const MAX_AGE = 60 * 60 * 24 * 15;

// TODO: No reason to have so much info in the session
// This WalletUser type can get smaller over time
export function encryptSession(session: WalletUser): Promise<string> {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults);
}

export async function getSession(req: NextApiRequest): Promise<WalletUser> {
  const token = getTokenCookie(req);
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
}

function parseCookies(req: { cookies: any; headers: { cookie: any } }) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) {
    return req.cookies;
  }

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}

export function setTokenCookie(
  res: { setHeader: (arg0: string, arg1: any) => void },
  token: string
): void {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
  res.setHeader('Set-Cookie', cookie);
}

export function getTokenCookie(req: any) {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
}

export function removeTokenCookie(
  res: NextApiResponse<{ done: boolean } | { user: WalletUser }>
): void {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

interface HandleWalletAuthProps {
  inviteCode?: string;
  provider: JsonRpcProvider;
  onAuthenticated: (arg0: Account) => void;
  onSignMessageError: (arg: any) => void;
  onRequestAccountsSuccess: () => void;
  onSignMessageSuccess: () => void;
  onUnsupportedAccountType: () => void;
}

export async function handleWalletAuth({
  provider,
  onAuthenticated,
  onSignMessageError,
  onRequestAccountsSuccess,
  onSignMessageSuccess,
  onUnsupportedAccountType,
}: HandleWalletAuthProps): Promise<void> {
  // TODO: Reflect in state that the user clicked it
  // and use that to determine what the button shows

  // Handle the case when an account is an unsupported smart contract wallet
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const bytecode = await provider.getCode(address);
  const isSmartContract = bytecode && hexStripZeros(bytecode) !== '0x';
  if (isSmartContract) {
    return onUnsupportedAccountType();
  }

  // TODO: Use the same method for handling accounts changes
  // that we use in use-provider
  try {
    onRequestAccountsSuccess();
  } catch (err) {
    throw new Error(err);
  }

  // Wait a little bit before triggering signature
  // This seems to fix freezing on MetaMask iOS app
  await new Promise((resolve) => setTimeout(resolve, 750));

  try {
    // TODO: Decide whether to put the the invite code
    // in the onSuccess handler here rather than passing
    // invite code through
    await handleExternalWalletAuth({
      provider,
      onAuthenticated,
      onError: onSignMessageError,
      onSuccess: onSignMessageSuccess,
    });
  } catch (err) {
    // throw new Error(err);
    onSignMessageError(err);
  }
}

export const useExternalWalletLogout = (): (() => Promise<void>) => {
  const { removeLastConnector } = useLastConnector();
  const [, , removeWalletConnect] =
    useLocalStorage<WalletProvider>('walletconnect');

  const setWalletState = useWalletState((state) => state.setWalletState);

  const queryClient = useQueryClient();

  const handleExternalWalletLogout = async () => {
    // Call logout api to remove session cookie
    await fetch('/api/logout-external-wallet-user');
    // Remove any cached user info
    queryClient.invalidateQueries(QueryCacheKey.WalletUser);
    // Reset balance cache for next login
    queryClient.invalidateQueries(QueryCacheKey.Balance);
    // Set WalletState to disconnected
    setWalletState(WalletState.Disconnected);
    // Remove walletconnect
    removeWalletConnect();
    // Remove last connector used
    removeLastConnector();
  };

  return handleExternalWalletLogout;
};

// ETH token functions

export const createToken = async (
  provider: JsonRpcProvider,
  publicKey: string
): Promise<string> => {
  const message = 'Please sign this message to connect to Foundation.';
  const hexlifiedMessage = hexlify(toUtf8Bytes(message));
  const signature = await provider.send('personal_sign', [
    hexlifiedMessage,
    publicKey.toLowerCase(),
  ]);

  const encodedMessage = encodeData(message);
  return `${encodedMessage}.${signature}`;
};

const encodeData = (
  unencoded:
    | WithImplicitCoercion<string>
    | { [Symbol.toPrimitive](hint: 'string'): string }
) => {
  try {
    return Buffer.from(unencoded, 'binary').toString('base64');
  } catch (err) {
    throw new Error(err);
  }
};

export const decodeData = (encoded: string): string => {
  try {
    return Buffer.from(encoded, 'base64').toString('binary');
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

interface UpsertAndGetUserArgs {
  payload: {
    providerType: string;
  };
  token: string;
}

export async function upsertAndGetUser({
  payload,
  token,
}: UpsertAndGetUserArgs): Promise<{ user: Account }> {
  /*
    we need to upsert user to prevent null email errors
    on creator onboarding

    TODO: investigate a more performant way to do this
  */

  const [data, signature] = token.split('.');
  const message = decodeData(data);
  const publicKey = verifyMessage(message, signature);

  try {
    await upsertUser({ data: payload, token });
  } catch (err) {
    console.error(JSON.stringify(err, undefined, 2));
    await captureError(err);
  }

  return await getHasuraUserByPublicKey(publicKey);
}

export async function getUserByAuthToken({ token }): Promise<Account> {
  try {
    const [data, signature] = token.split('.');
    const message = decodeData(data);
    const publicKey = verifyMessage(message, signature);
    const { user } = await getHasuraUserByPublicKey(publicKey);
    return user;
  } catch (err) {
    console.error(JSON.stringify(err, undefined, 2));
    await captureError(err);
    return undefined;
  }
}

export async function encryptAndSaveSession({ session, res }): Promise<void> {
  const sessionToken = await encryptSession(session);

  setTokenCookie(res, sessionToken);
}

export async function captureError(err: any): Promise<void> {
  Sentry.captureException(getError(err));
  await Sentry.flush(2000);
}

interface HandleExternalWalletAuthProps {
  inviteCode?: string;
  provider: JsonRpcProvider;
  onAuthenticated: (arg0: Account) => void;
  onError: (error: any) => void;
  onSuccess: () => void;
}

async function handleExternalWalletAuth({
  provider,
  onAuthenticated,
  onError,
  onSuccess,
}: HandleExternalWalletAuthProps) {
  try {
    const token = await getToken(provider);
    const providerType =
      provider.connection.url === 'metamask' ? 'METAMASK' : 'WALLETCONNECT';

    // TODO: Make this more RESTful
    // TODO: Remove publicAddress from the request body and decode it from JWT
    // on the api/new-external-wallet-user side
    const res = await fetch('/api/new-external-wallet-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note that /connect has a bearer token here
      },
      body: JSON.stringify({ token, providerType }),
    });

    // console.log({ inviteCode });
    const { success, user, error } = await handleNewUserRes(res);

    if (!success) {
      throw new Error(error);
    }
    onSuccess();
    onAuthenticated(user);
    await sendAnalyticsAndRedirect({
      onAuthenticated,
      user,
    });
  } catch (err) {
    // console.log({ err });
    Sentry.captureException(getError(err));
    onError(err);
  }
}

export async function getToken(provider: JsonRpcProvider): Promise<string> {
  const signer = provider.getSigner();
  const publicAddress = await signer.getAddress();

  // Note: This step requires the user to sign a message in the MetaMask extension
  const token = await createToken(provider, publicAddress);

  return token;
}

export const isAuthenticatedRoute = (pathname: string): boolean => {
  const authenticatedRoutes = [
    '/[username]/[slug]/bid',
    '/[username]/[slug]/bid/submitted',
    '/[username]/[slug]/settle',
    '/[username]/[slug]/settle/submitted',
    '/[username]/[slug]/list',
    '/[username]/[slug]/list/submitted',
    '/[username]/[slug]/change-price',
    '/[username]/[slug]/change-price/submitted',
    '/[username]/[slug]/unlist',
    '/[username]/[slug]/unlist/submitted',
    '/admin/approve',
    '/creator/upload',
    '/creator/create',
    '/creator/mint/[id]',
    '/creator/mint/[id]/submitted',
    '/creator/[slug]/tags',
    '/creator/[slug]/list',
    '/creator/[slug]/list/submitted',
    '/profile',
    '/profile/verify',
    '/profile/verify/twitter',
    '/profile/verify/instagram',
    '/invite',
    '/collection',
    '/balance',
    '/bids',
    '/join',
    '/feed',
    '/notifications',
    '/settings',
    '/migrate-account',
  ];

  return includes(pathname, authenticatedRoutes);
};

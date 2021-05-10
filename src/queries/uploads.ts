import * as Sentry from '@sentry/react';
import { gql } from '@apollo/client';
import { PinataApiKeyResult } from 'hooks/queries/use-generate-pinata-key';

import { fndServerClient } from 'lib/clients/graphql';
import { getError } from 'utils/helpers';

const SIGN_FILES = gql`
  mutation signFiles($files: [FileInput!]!) {
    signFiles(files: $files) {
      signedRequest
      url
    }
  }
`;

export async function signFiles({ token, files }) {
  const client = fndServerClient(token);
  return await client.request(SIGN_FILES, { files });
}

export const uploadFile = async (file, signedRequest, url) => {
  const options = {
    method: 'PUT',
    body: file,
  };
  const res = await fetch(signedRequest, options);
  if (!res.ok) {
    const err = new Error(`${res.status}: ${res.statusText}`);
    Sentry.captureException(getError(err));
    throw err;
  }
  return url;
};

export const generatePinataApiKey = async (
  token: string
): Promise<PinataApiKeyResult> => {
  const res = await fetch('/api/pinata/generate-api-key', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const err = new Error(`${res.status}: ${res.statusText}`);
    Sentry.captureException(getError(err));
    throw err;
  }
  return await res.json();
};

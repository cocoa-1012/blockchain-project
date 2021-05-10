import { AlchemyProvider } from '@ethersproject/providers';

import getAlchemyAPIKey from 'lib/getAlchemyAPIKey';

import { maybeGetAddress } from 'utils/users';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export async function getENSNameByPublicKey(publicKey: string) {
  try {
    // prod-only as ENS names carry over to goerli
    const provider = new AlchemyProvider('homestead', getAlchemyAPIKey());
    return await provider.lookupAddress(maybeGetAddress(publicKey));
  } catch (err) {
    return null;
  }
}

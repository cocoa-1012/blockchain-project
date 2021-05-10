import { useEffect, useState } from 'react';

import useAuthToken from 'hooks/queries/use-auth-token';
import {
  AlchemyProvider,
  AlchemyWebSocketProvider,
  Web3Provider,
} from '@ethersproject/providers';
import getChainId from 'lib/chainId';
import getAlchemyAPIKey from 'lib/getAlchemyAPIKey';

interface UseProviderResult {
  isLoading: boolean;
  provider: Web3Provider;
}

let ethersWebsocketProvider: AlchemyWebSocketProvider;

const chainId = getChainId();

export default function useReadOnlyProvider(): UseProviderResult {
  // TODO: Handle the loading state for useAuthToken?
  const { user, isLoading: isUserLoading } = useAuthToken();
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getReadOnlyProvider(): Promise<AlchemyWebSocketProvider> {
    if (!provider) {
      // Note: null for first param defaults to mainnet
      ethersWebsocketProvider = AlchemyProvider.getWebSocketProvider(
        chainId === 1 ? null : 'goerli',
        getAlchemyAPIKey()
      );

      return ethersWebsocketProvider;
    }
    return provider;
  }

  useEffect(() => {
    const initProvider = async () => {
      const provider = await getReadOnlyProvider();
      setProvider(provider);
      setIsLoading(false);
    };
    if (!provider && user && !isUserLoading) {
      initProvider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, provider, isUserLoading]);

  return {
    isLoading: isLoading,
    provider,
  };
}

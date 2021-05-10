import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';

import { WalletProvider } from 'types/Wallet';

import useLastConnectorState, {
  LastConnector,
} from 'state/stores/last-connector';

interface UseLastConnector {
  lastConnector: LastConnector;
  setLastConnector: (wallet: WalletProvider) => void;
  removeLastConnector: () => void;
}

export default function useLastConnector(): UseLastConnector {
  const { wallet, isLoading, setLastConnector } = useLastConnectorState();

  const [
    lastConnectorLS,
    setLastConnectorLS,
    removeLS,
  ] = useLocalStorage<WalletProvider>('last_connector');

  useEffect(() => {
    setLastConnector({ wallet: lastConnectorLS, isLoading: false });
  }, [lastConnectorLS, setLastConnector]);

  const handleSetLastConnector = (wallet: WalletProvider) => {
    setLastConnectorLS(wallet);
    setLastConnector({ wallet: wallet, isLoading: false });
  };

  const handleRemoveLastConnector = () => {
    removeLS();
    setLastConnector({ wallet: null, isLoading: false });
  };

  return {
    lastConnector: { wallet, isLoading },
    setLastConnector: handleSetLastConnector,
    removeLastConnector: handleRemoveLastConnector,
  };
}

import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import useLastConnector from 'hooks/web3/use-last-connector';
import { injectedConnector, walletConnectConnector } from 'lib/connectors';
import { WalletProvider } from 'types/Wallet';

export default function useEagerConnect(): boolean {
  const { lastConnector } = useLastConnector();

  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (lastConnector.isLoading) {
      return;
    }

    if (lastConnector.wallet === WalletProvider.WalletConnect) {
      activate(walletConnectConnector, undefined, true).catch(() => {
        setTried(true);
      });
      setTried(true);
    }

    if (lastConnector.wallet === WalletProvider.MetaMask) {
      injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
        if (isAuthorized) {
          activate(injectedConnector, undefined, true).catch(() => {
            setTried(true);
          });
          setTried(true);
        } else {
          setTried(true);
        }
      });
    }
    setTried(true);
  }, [activate, lastConnector.isLoading, lastConnector.wallet]);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

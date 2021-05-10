import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import { WALLETCONNECT_BRIDGE } from 'lib/constants';

// We only support 1, 5 but 3,4 are added so that web3 react responds correctly to show a wrong network label
export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 10, 42, 69, 77, 100],
});

export const walletConnectConnector = new WalletConnectConnector({
  rpc: {
    1: process.env.NEXT_PUBLIC_RPC_URI,
    3: process.env.NEXT_PUBLIC_RPC_URI,
    4: process.env.NEXT_PUBLIC_RPC_URI,
    5: process.env.NEXT_PUBLIC_RPC_URI,
  },
  bridge: WALLETCONNECT_BRIDGE,
  qrcode: true,
  pollingInterval: 15000,
  qrcodeModalOptions: {
    mobileLinks: ['rainbow', 'metamask', 'trust', 'imtoken'],
  },
});

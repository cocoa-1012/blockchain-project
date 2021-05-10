import create from 'zustand';
import { WalletProvider } from 'types/Wallet';

export interface LastConnector {
  wallet: WalletProvider;
  isLoading: boolean;
  setLastConnector?: (newState: LastConnector) => void;
}

const useLastConnectorState = create<LastConnector>((set) => ({
  wallet: null,
  isLoading: true,
  setLastConnector: (newState) => set(newState),
}));

export default useLastConnectorState;

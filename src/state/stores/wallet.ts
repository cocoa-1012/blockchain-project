import create from 'zustand';

import { WalletState } from 'types/Wallet';

interface WalletStateProps {
  walletState: WalletState;
  setWalletState: (value: WalletState) => void;
}

const useWalletState = create<WalletStateProps>((set) => ({
  walletState: WalletState.Loading,
  setWalletState: (value) => set({ walletState: value }),
}));

export default useWalletState;

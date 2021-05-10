export enum WalletState {
  Loading = 'loading',
  Disconnected = 'disconnected',
  Connected = 'connected',
  MetaMaskNotInstalled = 'not-installed',
  WrongNetwork = 'wrong-network',
  SignMessage = 'sign-message',
  SignMessageError = 'sign-message-error',
  SignMessageSuccess = 'sign-message-success',
  RequestAccountError = 'request-account-error',
  RequestAccountSuccess = 'request-account-success',
  UnsupportedAccountType = 'unsupported-account-type',
}

export enum WalletProvider {
  MetaMask,
  WalletConnect,
}

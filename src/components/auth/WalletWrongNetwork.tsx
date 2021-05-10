/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box } from 'theme-ui';

import getChainId from 'lib/chainId';

import ModalHeading from 'components/modals/common/ModalHeading';
import ModalCopy from 'components/modals/common/ModalCopy';

import ChangeNetworkIcon from 'assets/icons/change-network.svg';

const rightChain = getChainId();

export default function WalletWrongNetwork(): JSX.Element {
  const networkName =
    rightChain === 1
      ? 'Ethereum mainnet'
      : rightChain === 3
      ? 'Ropsten testnet'
      : rightChain === 4
      ? 'Rinkeby testnet'
      : 'Goerli testnet';
  return (
    <Box>
      <Flex sx={{ marginBottom: 'm', justifyContent: 'center' }}>
        <ChangeNetworkIcon width={32} height={32} sx={{ display: 'block' }} />
      </Flex>

      <ModalHeading sx={{ marginBottom: 's' }}>Wrong network</ModalHeading>

      <ModalCopy sx={{ fontSize: 'sub', maxWidth: 280 }}>
        Your wallet is currently connected to a different network. Please change
        it to the {networkName} to continue.
      </ModalCopy>
    </Box>
  );
}

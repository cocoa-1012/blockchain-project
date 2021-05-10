import { useCallback } from 'react';

import { ModalKey } from 'types/modal';

import Box from 'components/base/Box';
import Button from 'components/base/Button';

import useModal from 'hooks/use-modal';

export default function ConnectWalletWideButton(): JSX.Element {
  const { setCurrentModal } = useModal();

  const openModal = useCallback(() => {
    setCurrentModal(ModalKey.AUTH_MAIN);
  }, [setCurrentModal]);

  return (
    <Box>
      <Button
        color="black"
        size="large"
        shape="round"
        css={{ width: '100%', fontSize: '$2' }}
        onClick={openModal}
      >
        Connect Wallet
      </Button>
    </Box>
  );
}

import { useEffect } from 'react';
import { useMedia } from 'react-use';

import { ModalKey } from 'types/modal';

import useModal from './use-modal';

export default function useUnsupportedFlow(): void {
  const isLargeScreen = useMedia('(min-width: 40em)');

  const { resetModal, setCurrentModal } = useModal();

  // Handle flows that arent currently supported on mobile
  useEffect(() => {
    if (!isLargeScreen) {
      setCurrentModal(ModalKey.MOBILE_NOT_SUPPORTED);
    } else {
      resetModal();
    }
  }, [isLargeScreen, setCurrentModal, resetModal]);
}

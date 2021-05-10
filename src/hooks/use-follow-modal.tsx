import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { ModalMode, ModalKey } from 'types/modal';
import { getFirstValue } from 'utils/helpers';

import useModal from './use-modal';

interface FollowModal {
  toggleModal: (arg0: ModalMode) => void;
}

export default function useFollowModal(publicKey: string): FollowModal {
  const { setCurrentModal, setModalEntity, setModalMode } = useModal();

  const toggleModal = (modalMode: ModalMode) => {
    setModalMode(modalMode);
    setCurrentModal(ModalKey.FOLLOWS);
    setModalEntity(publicKey);
  };

  return {
    toggleModal,
  };
}

export function useFollowModalProfile(publicKey: string): null {
  const { resetModal } = useModal();
  const { toggleModal } = useFollowModal(publicKey);

  const router = useRouter();

  const shouldOpenModal = getFirstValue(router.query['follows']);

  useEffect(
    () => {
      if (shouldOpenModal) {
        toggleModal(ModalMode.Following);
      } else {
        resetModal();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shouldOpenModal, publicKey]
  );

  return null;
}

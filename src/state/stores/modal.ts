import create from 'zustand';
import { ModalMode, ModalKey } from 'types/modal';

export interface Modal {
  modalKey: ModalKey;
  entityId: string;
  currentTab: ModalMode;
  setModalState?: (newState: Modal) => void;
  setModalKey?: (value: ModalKey) => void;
  setModalEntity?: (value: string) => void;
  setModalTab?: (value: ModalMode) => void;
  resetModalState?: () => void;
}

const useModalState = create<Modal>((set) => ({
  modalKey: null,
  entityId: null,
  currentTab: null,
  setModalState: (newState) => set(newState),
  setModalKey: (value) => set({ modalKey: value }),
  setModalEntity: (value) => set({ entityId: value }),
  setModalTab: (value) => set({ currentTab: value }),
  resetModalState: () =>
    set({ modalKey: null, entityId: null, currentTab: null }),
}));

export default useModalState;

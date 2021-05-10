import OpenIcon from 'assets/icons/open-icon.svg';
import CloseIcon from 'assets/icons/close-icon.svg';

import MobileHeaderButton from './MobileHeaderButton';

interface MobileHeaderOpenButtonProps {
  setOpen: (arg0: boolean) => void;
  isOpen: boolean;
}

export default function MobileHeaderOpenButton(
  props: MobileHeaderOpenButtonProps
): JSX.Element {
  const { setOpen, isOpen } = props;

  return (
    <MobileHeaderButton
      openIcon={
        <OpenIcon width={24} height={16} style={{ display: 'block' }} />
      }
      closeIcon={
        <CloseIcon width={20} height={20} style={{ display: 'block' }} />
      }
      setOpen={setOpen}
      isOpen={isOpen}
    />
  );
}

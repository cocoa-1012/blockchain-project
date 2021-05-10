import SearchIcon from 'assets/icons/search-icon.svg';
import CloseIcon from 'assets/icons/close-icon.svg';
import MobileHeaderButton from './MobileHeaderButton';

interface MobileHeaderSearchButtonProps {
  setOpen: (arg0: boolean) => void;
  isOpen: boolean;
}

export default function MobileHeaderSearchButton(
  props: MobileHeaderSearchButtonProps
): JSX.Element {
  const { setOpen, isOpen } = props;

  return (
    <MobileHeaderButton
      openIcon={
        <SearchIcon width={19} height={19} style={{ display: 'block' }} />
      }
      closeIcon={
        <CloseIcon width={20} height={20} style={{ display: 'block' }} />
      }
      setOpen={setOpen}
      isOpen={isOpen}
    />
  );
}

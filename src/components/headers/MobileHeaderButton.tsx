import { motion } from 'framer-motion';
import { ReactNode } from 'react';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';

import { styled } from 'stitches.config';

const HeaderButton = styled(Flex, {
  color: '$black100',
  minHeight: 54,
  minWidth: 54,
  borderRadius: 999,
  backgroundColor: '$white100',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  willChange: 'transform',
  boxShadow: '$0',
  border: 'none',
});

interface MobileHeaderOpenButtonProps {
  setOpen: (boolean) => void;
  isOpen: boolean;
  closeIcon: ReactNode;
  openIcon: ReactNode;
}

export default function MobileHeaderButton(
  props: MobileHeaderOpenButtonProps
): JSX.Element {
  const { setOpen, isOpen, openIcon, closeIcon } = props;

  return (
    <Box
      as={motion.div}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
      css={{ '@bp1': { display: 'none' } }}
    >
      <HeaderButton
        css={{ marginLeft: '$3' }}
        onClick={() => setOpen(!isOpen)}
        as="button"
      >
        {isOpen ? closeIcon : openIcon}
      </HeaderButton>
    </Box>
  );
}

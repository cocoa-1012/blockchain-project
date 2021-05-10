import { motion } from 'framer-motion';

import Box from 'components/base/Box';
import Button from 'components/base/Button';

import { styled } from 'stitches.config';

interface SearchFiltersToggleProps {
  openSearch: () => void;
}

export default function SearchFiltersToggle(
  props: SearchFiltersToggleProps
): JSX.Element {
  const { openSearch } = props;
  return (
    <Box
      css={{
        position: 'fixed',
        bottom: '$7',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'block',
        '@bp2': {
          display: 'none',
        },
      }}
    >
      <ArtworkFiltersOpenButton
        color="black"
        size="large"
        shape="regular"
        as={motion.div}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.1 }}
        onClick={openSearch}
      >
        Filters
      </ArtworkFiltersOpenButton>
    </Box>
  );
}

const ArtworkFiltersOpenButton = styled(Button, {
  paddingX: '$8',
  borderRadius: 999,
  fontSize: '$2',
  boxShadow: '$3',
});

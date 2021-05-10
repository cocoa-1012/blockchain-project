/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Text } from 'theme-ui';
import PropTypes from 'prop-types';
import ArrowDownIcon from 'assets/icons/arrow-down-icon.svg';
import { transitions } from 'utils/themes/main/theme';

ScrollToContent.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

export default function ScrollToContent(props) {
  const { text = 'Scroll to content', className } = props;
  const sx = getStyles();

  const scrollToDetails = () => {
    window.scrollBy({
      top: window.innerHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Flex sx={sx.container} className={className} onClick={scrollToDetails}>
      <ArrowDownIcon />
      <Text variant="body.body" sx={sx.text}>
        {text}
      </Text>
    </Flex>
  );
}

const getStyles = () => ({
  container: {
    cursor: 'pointer',
    alignItems: 'center',
    color: 'black.30',
    '@media (hover: hover)': {
      transition: transitions.smooth.fast,
      '&:hover': {
        color: 'black.100',
      },
    },
  },
  text: { fontWeight: 'bold', ml: 'xs' },
});

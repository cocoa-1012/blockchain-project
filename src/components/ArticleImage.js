/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Image } from 'theme-ui';
import PropTypes from 'prop-types';
import { urlWithParams } from 'utils/urls';

ArticleImage.propTypes = {
  src: PropTypes.string.isRequired,
};
export function ArticleImage(props) {
  const { src } = props;

  const imageUrl = urlWithParams(src, {
    q: 70,
    w: 1440,
    fit: 'fill',
  });

  return (
    <Box sx={{ maxWidth: 1000, marginX: 'auto' }}>
      <Box marginY={['xl', 'xxl', 'xxxl']} marginX={[-24, null, null, 0]}>
        <Image sx={{ display: 'block', maxWidth: '100%' }} src={imageUrl} />
      </Box>
    </Box>
  );
}

ArticleImage.propTypes = {
  id: PropTypes.string,
};

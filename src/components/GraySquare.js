/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import PropTypes from 'prop-types';

const arrayOrNumber = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
  PropTypes.array,
]);

GraySquare.propTypes = {
  bg: PropTypes.string,
  height: arrayOrNumber,
  width: arrayOrNumber,
  borderRadius: arrayOrNumber,
  mb: arrayOrNumber,
  ml: arrayOrNumber,
  className: PropTypes.string,
  children: PropTypes.any,
};

GraySquare.defaultProps = {
  bg: 'black.10',
  height: 24,
  width: 78,
  borderRadius: 4,
  mb: 0,
  ml: 0,
};

export default function GraySquare(props) {
  const {
    bg,
    height,
    width,
    borderRadius,
    mb,
    ml,
    className,
    children,
  } = props;
  return (
    <Box
      bg={bg}
      sx={{ height, width, borderRadius, mb, ml }}
      className={className}
    >
      {children}
    </Box>
  );
}

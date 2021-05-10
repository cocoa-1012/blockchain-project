/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Button } from 'theme-ui';

import { transitions } from 'utils/themes/main/theme';

import Link from 'components/links/Link';

interface HeaderCreatorUploadLinkProps {
  className?: string;
}

export default function HeaderCreatorUploadLink(
  props: HeaderCreatorUploadLinkProps
): JSX.Element {
  const { className } = props;

  const sx = getStyles();

  return (
    <Box className={className}>
      <Link href="/creator/create">
        <a sx={sx.link}>
          <Button sx={sx.button}>Create</Button>
        </a>
      </Link>
    </Box>
  );
}

const getStyles = () => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    boxShadow: 's',
    borderRadius: 999,
    border: 'none',
    transition: transitions.smooth.fast,
    fontSize: 'xs',
    paddingX: ['m', 'm', 'm'],

    minHeight: 54,
    maxHeight: 54,
    backgroundColor: '#cf2ff9',
    backgroundImage: 'url(/images/fnd-gradient.jpg)',
    backgroundSize: '100% auto',
    backgroundPosition: 'center bottom',
    '@media (hover: hover)': {
      '&:hover': {
        boxShadow: 'm',
        backgroundSize: '105% auto',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        boxShadow: 'm',
        backgroundSize: '105% auto',
        transform: 'translateY(0)',
      },
    },
  },
});

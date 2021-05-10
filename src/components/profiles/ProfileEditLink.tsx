/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Button } from 'theme-ui';
import { ReactNode } from 'react';

import Link from 'components/links/Link';

import { getButtonStyles } from './styles';
import { CardDimension } from 'types/Card';

interface ProfileEditLinkProps {
  size: CardDimension;
}

export default function ProfileEditLink(
  props: ProfileEditLinkProps
): JSX.Element {
  const { size } = props;

  const sx = getButtonStyles(size);

  return (
    <Link href="/profile">
      <a>
        <Button sx={sx.button} variant="ghost">
          Edit Profile
        </Button>
      </a>
    </Link>
  );
}

interface ProfileEditPinProps {
  children: ReactNode;
}

export function ProfileEditPin(props: ProfileEditPinProps): JSX.Element {
  const { children } = props;
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: ['none', null, 'block'],
          position: [null, null, 'absolute'],
          top: [null, null, 72],
          right: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';

import Link from 'components/links/Link';

import { transitions } from 'utils/themes/main/theme';

import { PopoverMenuOption } from './types';

interface PopoverMenuProps {
  options: PopoverMenuOption[];
}

interface PopoverLinkProps {
  option: PopoverMenuOption;
}

export default function PopoverMenu(props: PopoverMenuProps): JSX.Element {
  const { options } = props;
  return (
    <Box
      sx={{
        boxShadow: 's',
        backgroundColor: 'white.100',
        borderRadius: 10,
        padding: 10,
        whiteSpace: 'pre',
      }}
    >
      {options.map((option, key) => {
        if (option.externalHref) {
          return (
            <a
              href={option.externalHref}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none' }}
              key={key}
            >
              <PopoverLinkContainer option={option} />
            </a>
          );
        }
        if (option.href) {
          return <PopoverLink option={option} key={key} />;
        }
        if (option.onClick) {
          return <PopoverAction option={option} key={key} />;
        }
      })}
    </Box>
  );
}

function PopoverAction(props: PopoverLinkProps): JSX.Element {
  const { option } = props;
  return (
    <Box onClick={option.onClick} sx={{ cursor: 'pointer' }}>
      <PopoverLinkContainer option={option} />
    </Box>
  );
}

function PopoverLink(props: PopoverLinkProps): JSX.Element {
  const { option } = props;
  return (
    <Link href={option.href}>
      <a sx={{ textDecoration: 'none' }}>
        <PopoverLinkContainer option={option} />
      </a>
    </Link>
  );
}

function PopoverLinkContainer(props: PopoverLinkProps) {
  const { option } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        textDecoration: 'none',
        color: 'black.100',
        transition: transitions.smooth.fast,
        ...option?.sx,
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: 'black.5',
          },
        },
      }}
    >
      <Box sx={{ marginRight: 12, display: 'flex', alignItems: 'center' }}>
        {option.icon}
      </Box>
      <Text variant="h.xs">{option.children}</Text>
    </Box>
  );
}

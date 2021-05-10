/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, Text } from 'theme-ui';
import { forwardRef, ReactNode } from 'react';

import { transitions } from 'utils/themes/main/theme';

import ChevronRight from 'assets/icons/right-chevron.svg';
import Link from 'components/links/Link';

interface UserDropdownLinkProps {
  onClick?: () => void;
  icon: JSX.Element;
  children: ReactNode;
  href?: string;
}

export default function UserDropdownLink(
  props: UserDropdownLinkProps
): JSX.Element {
  const { children, icon, href, onClick } = props;

  if (onClick) {
    return (
      <InnerLink onClick={onClick} icon={icon}>
        {children}
      </InnerLink>
    );
  }
  return (
    <Link href={href}>
      <InnerLink icon={icon}>{children}</InnerLink>
    </Link>
  );
}

interface InnerLinkProps {
  onClick?: () => void;
  icon: JSX.Element;
  children: ReactNode;
}

const InnerLink = forwardRef<HTMLDivElement, InnerLinkProps>((props, ref) => {
  const { onClick, icon, children } = props;
  return (
    <Flex
      ref={ref}
      onClick={onClick}
      sx={{
        paddingY: 20,
        borderBottom: 'solid 1px',
        borderBottomColor: 'black.5',
        transition: transitions.smooth.fast,
        alignItems: 'center',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        willChange: 'transform',
        '@media (hover: hover)': {
          '&:hover .icon-label': {
            transform: 'translateX(5px)',
          },
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <Flex
        sx={{
          flex: 'auto',
          alignItems: 'center',
          transition: transitions.smooth.fast,
        }}
        className="icon-label"
      >
        <Box sx={{ minWidth: 36 }}>{icon}</Box>
        <Text variant="h.xs" sx={{ flex: 1, display: 'flex' }}>
          {children}
        </Text>
      </Flex>

      <ChevronRight />
    </Flex>
  );
});

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Link, Text, Flex } from 'theme-ui';
import { ReactNode } from 'react';

import Hoverable from 'components/Hoverable';
import SpinnerStroked from 'components/SpinnerStroked';

import VerifiedBadge from 'assets/icons/verified-badge.svg';
import DeleteIcon from 'assets/icons/delete-icon-simple.svg';

import { SocialLinkProps } from './types';
import { getLinkStyles } from './styles';

import { transitions } from 'utils/themes/main/theme';

interface RemoveableLinkProps {
  isLoading: boolean;
  onClick: () => void;
}

export default function SocialLinkVerified(
  props: SocialLinkProps
): JSX.Element {
  const { handle, children, linkBuilderFn, icon } = props;

  const sx = getLinkStyles();

  if (!linkBuilderFn) {
    return (
      <Hoverable>
        <Box sx={sx.link}>
          <SocialLinkVerifiedInner icon={icon}>
            {children}
          </SocialLinkVerifiedInner>
        </Box>
      </Hoverable>
    );
  }

  return (
    <Hoverable>
      <Link
        href={linkBuilderFn(handle)}
        sx={sx.link}
        target="_blank"
        rel="noreferrer"
      >
        <SocialLinkVerifiedInner icon={icon}>
          {children}
        </SocialLinkVerifiedInner>
      </Link>
    </Hoverable>
  );
}

interface SocialLinkVerifiedInnerProps {
  children: ReactNode;
  icon: ReactNode;
}

export function SocialLinkVerifiedInner(
  props: SocialLinkVerifiedInnerProps
): JSX.Element {
  const { children, icon } = props;
  return (
    <>
      <VerifiedBadge style={{ display: 'block' }} width={19} height={19} />

      <Text variant="h.sub" sx={{ marginX: 7, position: 'relative', top: -1 }}>
        {children}
      </Text>
      {icon}
    </>
  );
}

interface SocialLinkRemoveableInnerProps extends RemoveableLinkProps {
  children: ReactNode;
  icon: ReactNode;
}

export function SocialLinkRemoveableInner(
  props: SocialLinkRemoveableInnerProps
): JSX.Element {
  const { children, icon, isLoading, onClick } = props;

  return (
    <>
      {isLoading ? (
        <SpinnerStroked size={19} />
      ) : (
        <Flex
          onClick={onClick}
          sx={{
            cursor: 'pointer',
            width: 19,
            justifyContent: 'center',
            color: 'black.20',
            transition: transitions.smooth.fast,
            '@media (hover: hover)': {
              '&:hover': {
                color: 'utility.red',
              },
            },
          }}
        >
          <DeleteIcon
            key="delete"
            style={{ display: 'block' }}
            width={12}
            height={12}
            className="delete-icon"
          />
          <VerifiedBadge
            key="verified"
            style={{ display: 'block' }}
            width={19}
            height={19}
            className="verified-icon"
          />
        </Flex>
      )}

      <Text
        sx={{ marginX: 7, position: 'relative', top: -1, cursor: 'default' }}
        variant="h.sub"
      >
        {children}
      </Text>
      {icon}
    </>
  );
}

interface SocialLinkRemoveableProps
  extends SocialLinkProps,
    RemoveableLinkProps {}

export function SocialLinkRemoveable(
  props: SocialLinkRemoveableProps
): JSX.Element {
  const { children, icon, isLoading, onClick } = props;

  const sx = getLinkStyles();

  return (
    <Box sx={{ ...sx.hoverable, pointerEvents: isLoading ? 'none' : 'all' }}>
      <SocialLinkRemoveableInner
        onClick={onClick}
        isLoading={isLoading}
        icon={icon}
      >
        {children}
      </SocialLinkRemoveableInner>
    </Box>
  );
}

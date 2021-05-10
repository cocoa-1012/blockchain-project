/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';

import GraySquare from 'components/GraySquare';
import { CardDimension } from 'types/Card';
import { transitions } from 'utils/themes/main/theme';

interface ProfileFollowCountProps {
  isLoading: boolean;
  followerCount: number;
  label: string;
  size: CardDimension;
  className?: string;
}

export default function ProfileFollowCount(
  props: ProfileFollowCountProps
): JSX.Element {
  const { isLoading, followerCount, label, size, className } = props;

  const isSmall = size === CardDimension.small;

  const isDimensionsLoading = size === CardDimension.loading;

  return (
    <Box
      className={className}
      sx={{
        color: 'black.50',
        '@media (hover: hover)': {
          '&:hover': {
            color: 'black.100',
          },
        },
      }}
    >
      {isLoading || isDimensionsLoading ? (
        <GraySquare
          height={isSmall ? 19 : 25}
          width={32}
          sx={{ marginTop: 2, marginBottom: 2 }}
        />
      ) : (
        <Text
          variant="h.s"
          sx={{
            color: 'black.100',
            fontSize: isSmall ? 'xs' : 's',
            transition: transitions.smooth.fast,
          }}
        >
          {followerCount}
        </Text>
      )}

      <Text
        variant="h.xs"
        sx={{
          color: 'inherit',
          fontSize: isSmall ? 'body' : 'xs',
          transition: transitions.smooth.fast,
        }}
      >
        {label}
      </Text>
    </Box>
  );
}

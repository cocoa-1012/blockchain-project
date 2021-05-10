/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, AspectRatio, Box, Grid } from 'theme-ui';

import { transitions } from 'utils/themes/main/theme';
import { StyleObject } from 'types/styles';
import GraySquare from 'components/GraySquare';

export default function CreatorCardSkeleton(): JSX.Element {
  const sx = getStyles();

  return (
    <Flex sx={sx.card}>
      <Box sx={{ position: 'relative' }}>
        <AspectRatio ratio={1.75} sx={sx.ratio} />
        <Box sx={{ marginX: 'm', position: 'relative' }}>
          <Box sx={sx.avatar}>
            <Box
              sx={{
                objectFit: 'fill',
                borderRadius: 999,
                backgroundColor: 'black.10',
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={sx.meta}>
        <Grid gap={5} sx={{ marginBottom: 's' }}>
          <GraySquare height={39} width={150} bg="black.5" />
          <GraySquare height={26} width={100} bg="black.5" />
        </Grid>
        <GraySquare height={75} width="100%" bg="black.5" />
      </Box>
    </Flex>
  );
}

const getStyles = (): StyleObject => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 's',
    borderRadius: 10,
    overflow: 'hidden',
    transition: transitions.smooth.fast,
    textDecoration: 'none',
    willChange: 'transform',
    color: 'black.100',
  },
  ratio: {
    backgroundColor: 'black.5',
    display: 'flex',
  },
  avatar: {
    padding: 8,
    backgroundColor: 'black.10',
    width: 96,
    height: 96,
    position: 'absolute',
    left: 0,
    transform: 'translateY(-50%)',
    display: 'flex',
    borderRadius: 999,
  },
  meta: {
    paddingX: 'm',
    paddingTop: 'xxl',
    paddingBottom: 'xl',
  },
});

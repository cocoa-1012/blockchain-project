/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import {
  jsx,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Grid,
  ThemeUIStyleObject,
} from 'theme-ui';
import { css, keyframes } from '@emotion/react';

import { transitions } from 'utils/themes/main/theme';

import ExternalLink from 'components/links/ExternalLink';

const translate = keyframes`
  from {
    background-position-x: 0;
  }
  100% {
    background-position-x: -150000px;
  }
`;

interface UploadArtworkProgressProps {
  progressPercentage: number;
  cancelUpload: () => void;
}

export default function UploadArtworkProgress(
  props: UploadArtworkProgressProps
): JSX.Element {
  const { progressPercentage, cancelUpload } = props;

  const sx = getStyles();

  return (
    <Grid sx={sx.container}>
      <Heading variant="h.xl" sx={sx.heading}>
        Uploading to IPFS…
      </Heading>
      <Grid gap="xl">
        <Flex sx={sx.progressContainer}>
          <Box
            css={css`
              animation: ${translate} 400s linear infinite;
              animate-fill-mode: forwards;
            `}
            style={{ width: `${progressPercentage}%` }}
            sx={sx.progress}
          />
        </Flex>
        <Grid sx={{ textAlign: 'center', gap: 's' }}>
          <Text variant="body.body" sx={sx.text}>
            The InterPlanetary File System, known as IPFS, is a peer-to-peer
            network for sharing data in a distributed file system.
          </Text>
          <ExternalLink href="https://ipfs.io/#why">
            Learn more about IPFS →
          </ExternalLink>
        </Grid>
      </Grid>

      <Box sx={sx.footer}>
        <Button onClick={cancelUpload} variant="outline" sx={sx.button}>
          Cancel upload
        </Button>
      </Box>
    </Grid>
  );
}

const getStyles = () => {
  const progressContainer: ThemeUIStyleObject = {
    height: 10,
    backgroundColor: 'black.10',
    borderRadius: 999,
  };

  const progress: ThemeUIStyleObject = {
    transition: transitions.smooth.medium,
    background:
      'linear-gradient(89.98deg, #76E650 0%, #F9D649 12.5%, #F08E35 25%, #EC5157 37.5%, #FF18BD 50%, #1A4BFF 62.5%, #62D8F9 75%, #76E650 87.5%)',
    backgroundSize: '400px auto',
    backgroundColor: 'black.50',
    borderRadius: 999,
  };

  const container: ThemeUIStyleObject = {
    maxWidth: 640,
    marginX: 'auto',
    gap: 'xl',
  };

  const heading: ThemeUIStyleObject = {
    textAlign: 'center',
    maxWidth: 480,
    marginX: 'auto',
  };

  const text: ThemeUIStyleObject = {
    maxWidth: 480,
    marginX: 'auto',
    textAlign: 'center',
  };

  const footer: ThemeUIStyleObject = {
    textAlign: 'center',
  };

  const button: ThemeUIStyleObject = {
    width: 180,
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 'xs',
    paddingX: ['s', 's', 's'],
  };

  return {
    progressContainer,
    progress,
    container,
    heading,
    text,
    footer,
    button,
  };
};

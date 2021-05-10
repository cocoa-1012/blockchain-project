/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import {
  jsx,
  Box,
  Heading,
  Button,
  Grid,
  Flex,
  Text,
  ThemeUIStyleObject,
} from 'theme-ui';
import { ReactNode } from 'react';

import Link from 'components/links/Link';

interface TransactionBlockProps {
  children?: ReactNode;
  title?: string;
  onDismiss?: () => void;
}

export default function TransactionBlock(
  props: TransactionBlockProps
): JSX.Element {
  const { children, title, onDismiss } = props;

  const sx = getStyles();

  return (
    <Flex sx={sx.container}>
      <Grid gap="l">
        <Heading variant="h.l" sx={{ textAlign: 'center' }}>
          {title}
        </Heading>
        <Grid gap="l">
          <Text sx={sx.text} variant="body.body">
            {children}
          </Text>

          <Grid
            gap={10}
            columns={onDismiss ? 2 : 1}
            sx={{ justifyContent: 'center', maxWidth: 400, marginX: 'auto' }}
          >
            <Box>
              <Link href="/creator/create">
                <a sx={sx.link}>
                  <Button type="button" sx={sx.button}>
                    Back
                  </Button>
                </a>
              </Link>
            </Box>
            {onDismiss && (
              <Box>
                <Button
                  onClick={onDismiss}
                  type="button"
                  variant="outline"
                  sx={{ width: '100%' }}
                >
                  Continue anyway
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Flex>
  );
}

export function DuplicateUploadArtworkBlock(): JSX.Element {
  return (
    <TransactionBlock title="You’ve already minted this artwork as an NFT.">
      On Foundation, each NFT is a unique 1/1 — we do not support an artwork
      being uploaded multiple times.
    </TransactionBlock>
  );
}

interface DuplicateMintArtworkBlockProps {
  onDismiss: () => void;
}

export function DuplicateMintArtworkBlock(
  props: DuplicateMintArtworkBlockProps
): JSX.Element {
  const { onDismiss } = props;
  return (
    <TransactionBlock title="You have already minted an NFT using this artwork.">
      You're not able to mint another version of this artwork.
    </TransactionBlock>
  );
}

const getStyles = () => {
  const link: ThemeUIStyleObject = {
    textDecoration: 'none',
    color: 'inherit',
    minWidth: 160,
    display: 'block',
  };
  const container: ThemeUIStyleObject = {
    maxWidth: 460,
    marginX: 'auto',
    flex: 1,
    alignItems: 'center',
    paddingBottom: 'xl',
  };

  const button: ThemeUIStyleObject = { display: 'block', width: '100%' };

  const text: ThemeUIStyleObject = {
    maxWidth: 400,
    marginX: 'auto',
    textAlign: 'center',
  };

  return { link, container, button, text };
};

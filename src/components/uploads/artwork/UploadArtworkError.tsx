/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import Body from 'components/Body';
import { jsx, Heading, Grid, Flex, Button } from 'theme-ui';

import { textAlignCenter } from 'types/styles';

interface UploadArtworkErrorProps {
  resetUpload: () => void;
}

export default function UploadArtworkError(
  props: UploadArtworkErrorProps
): JSX.Element {
  const { resetUpload } = props;

  const sx = getStyles();

  return (
    <Body sx={sx.container}>
      <Grid gap="xxl">
        <Heading variant="h.xl" sx={sx.heading}>
          There was an error uploading your artwork.
        </Heading>
        <Flex sx={sx.cta}>
          <Button variant="outline" sx={sx.button} onClick={resetUpload}>
            Try again
          </Button>
        </Flex>
      </Grid>
    </Body>
  );
}

const getStyles = () => ({
  container: {
    flex: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 'xxl',
    display: 'flex',
  },
  heading: {
    maxWidth: 680,
    marginX: 'auto',
    textAlign: textAlignCenter,
  },
  cta: { justifyContent: 'center', alignItems: 'center' },
  button: { width: 200, backgroundColor: 'transparent' },
});

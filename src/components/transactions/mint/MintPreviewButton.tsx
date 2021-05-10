/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Button, Text, ThemeUIStyleObject } from 'theme-ui';
import { useRouter } from 'next/router';

import useSaveDraftArtwork from 'hooks/use-save-draft-artwork';

import EyeIcon from 'assets/images/eye-icon.svg';

import { getFirstValue } from 'utils/helpers';

const buttonStyles: ThemeUIStyleObject = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (hover: hover)': {
    '&:hover': {
      color: 'white.100',
    },
  },
};

export default function MintPreviewButton(): JSX.Element {
  const router = useRouter();

  const artworkId = getFirstValue(router.query.id);

  const { isDraft, isSubmitting, saveAsDraft } = useSaveDraftArtwork({
    onCompleted: () => {
      const previewURL = new URL(`preview/${artworkId}`, location.origin);
      window.open(previewURL.href);
    },
  });

  if (!isDraft && isSubmitting) {
    return (
      <Button type="button" variant="outline" disabled={true} sx={buttonStyles}>
        <EyeIcon sx={{ display: 'block' }} />
        <Text
          variant="h.body"
          sx={{ marginLeft: 10, position: 'relative', top: -1 }}
        >
          Preview NFT
        </Text>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={saveAsDraft}
      disabled={isSubmitting}
      sx={buttonStyles}
    >
      <EyeIcon sx={{ display: 'block' }} />
      <Text
        variant="h.body"
        sx={{ marginLeft: 10, position: 'relative', top: -1 }}
      >
        Preview NFT
      </Text>
    </Button>
  );
}

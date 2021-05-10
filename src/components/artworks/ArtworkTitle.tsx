/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Heading } from 'theme-ui';

import GraySquare from 'components/GraySquare';

import { StyleObject } from 'types/styles';

interface ArtworkTitleProps {
  name: string;
}

export default function ArtworkTitle(props: ArtworkTitleProps): JSX.Element {
  const { name } = props;

  const sx = getStyles();

  return (
    <Heading variant="h.l" sx={sx.heading}>
      {name}
    </Heading>
  );
}

export function ArtworkTitleSkeleton(): JSX.Element {
  const sx = getStyles();
  return <GraySquare height={42} width={250} sx={sx.heading} />;
}

const getStyles = (): StyleObject => ({
  heading: {
    marginTop: 'm',
    marginBottom: ['m', null, null, '0'],
    wordWrap: 'break-word',
    hyphens: 'auto',
  },
});

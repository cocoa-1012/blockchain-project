import React, { ReactNode } from 'react';
import { styled } from 'stitches.config';
import Grid from 'components/base/Grid';

interface TeamGridProps {
  children: ReactNode;
  canvasActive: boolean;
}

const TeamGridContainer = styled(Grid, {
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gridRowGap: '$6',
  gridColumnGap: '$5',
  marginBottom: '$9',
  zIndex: 1,
  position: 'relative',
});

export default function TeamGrid(props: TeamGridProps): JSX.Element {
  const { children, canvasActive } = props;
  return (
    <TeamGridContainer css={{ pointerEvents: canvasActive ? 'none' : 'all' }}>
      {children}
    </TeamGridContainer>
  );
}

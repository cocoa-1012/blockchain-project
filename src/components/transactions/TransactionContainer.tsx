/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Box, ThemeUIStyleObject } from 'theme-ui';
import { ReactNode } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';

import ArtworkCardMinimal from 'components/cards/artwork/ArtworkCardMinimal';
import ArtworkCard from 'components/cards/artwork/ArtworkCard';
import Body from 'components/Body';

import Artwork from 'types/Artwork';
import { CardVariant } from 'types/Card';

interface TransactionContainerProps {
  children: ReactNode;
  artwork: Artwork;
  className?: string;
  cardVariant?: CardVariant;
}

export default function TransactionContainer(
  props: TransactionContainerProps
): JSX.Element {
  const {
    artwork,
    children,
    className,
    cardVariant = CardVariant.minimal,
  } = props;

  const sx = getStyles();

  return (
    <Grid
      sx={sx.container}
      className={classNames({
        className,
        'transaction-container': true,
      })}
    >
      <motion.div
        key="card"
        layout="position"
        className="transaction-card"
        sx={{ display: ['none', null, 'block'] }}
      >
        <Box sx={sx.panel}>
          {cardVariant === CardVariant.minimal ? (
            <ArtworkCardMinimal artwork={artwork} creator={artwork?.creator} />
          ) : (
            <ArtworkCard
              artwork={artwork}
              creator={artwork?.creator}
              mostRecentActiveAuction={artwork?.mostRecentActiveAuction}
            />
          )}
        </Box>
      </motion.div>

      <Box
        className="transaction-content"
        sx={{ paddingX: ['m', null, 0], paddingBottom: ['l', null, 0] }}
      >
        {children}
      </Box>
    </Grid>
  );
}

interface TransactionFormContainerProps {
  children: ReactNode;
  className?: string;
}

export function TransactionFormContainer(
  props: TransactionFormContainerProps
): JSX.Element {
  const { children, className } = props;
  return (
    <Body
      className={className}
      sx={{
        display: 'grid',
        flex: 'auto',
        alignItems: 'center',
        maxWidth: 1080,
      }}
    >
      {children}
    </Body>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginX: 'auto',
    gridTemplateColumns: [null, null, '340px 400px'],
    gap: [0, null, 'xxxl'],
    display: ['flex', null, 'grid'],
    justifyContent: ['center', null, 'flex-start'],
  };

  const panel: ThemeUIStyleObject = { maxWidth: [340, null, 'none'] };

  return { container, panel };
};

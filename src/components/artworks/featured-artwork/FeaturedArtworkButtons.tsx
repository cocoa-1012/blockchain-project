/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Button, ThemeUIStyleObject, Flex } from 'theme-ui';

import Link from 'components/links/Link';
import GraySquare from 'components/GraySquare';

const buttonStyles: ThemeUIStyleObject = {
  maxWidth: [null, null, 500],
  gap: [10, null, 's'],
};
interface FeaturedArtworkButtonsProps {
  isAuctionOpen: boolean;
  artworkPath: string;
  minutesRemaining: number;
  isLoading: boolean;
}

export default function FeaturedArtworkButtons(
  props: FeaturedArtworkButtonsProps
): JSX.Element {
  const { isAuctionOpen, artworkPath, minutesRemaining, isLoading } = props;

  const isEndingSoon = minutesRemaining < 15;

  if (isLoading) {
    return <SkeletonLoadingBlock />;
  }

  if (!isAuctionOpen || isEndingSoon) {
    return (
      <Box sx={buttonStyles}>
        <Link href={artworkPath}>
          <a sx={{ display: 'inline-block' }}>
            <Button
              variant="outline"
              sx={{
                paddingX: ['xl', 'xl', 'xl'],
                width: ['100%', 'auto'],
              }}
            >
              View artwork
            </Button>
          </a>
        </Link>
      </Box>
    );
  }

  return (
    <Grid
      sx={{
        ...buttonStyles,
        gridTemplateColumns: [null, '1fr 1fr', '3fr 2fr'],
      }}
    >
      <Link href={`${artworkPath}/bid`}>
        <a sx={{ display: 'block' }}>
          <Button sx={{ width: '100%' }}>Place a bid</Button>
        </a>
      </Link>

      <Link href={artworkPath}>
        <a sx={{ display: 'block' }}>
          <Button variant="outline" sx={{ width: '100%' }}>
            View artwork
          </Button>
        </a>
      </Link>
    </Grid>
  );
}

function SkeletonLoadingBlock(): JSX.Element {
  return (
    <Grid
      sx={{
        ...buttonStyles,
        gridTemplateColumns: [null, '1fr 1fr', '3fr 2fr'],
      }}
    >
      <Box>
        <GraySquare width="100%" height={60} sx={{ borderRadius: 15 }} />
      </Box>
      <Box>
        <GraySquare width="100%" height={60} sx={{ borderRadius: 15 }} />
      </Box>
    </Grid>
  );
}

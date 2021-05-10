import getUnixTime from 'date-fns/fp/getUnixTime';
import parseJSON from 'date-fns/fp/parseJSON';
import { compose } from 'ramda';
import { ReactNode } from 'react';

import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Grid from 'components/base/Grid';
import ArtworkCardCountdown from './ArtworkCardCountdown';

import { styled } from 'stitches.config';

import useCountdown from 'hooks/use-countdown';

import {
  AlgoliaArtwork,
  AlgoliaArtworkAvailability,
  AlgoliaAuction,
  AlgoliaAuctionStatus,
} from 'types/Algolia';

import { formatETHWithSuffix } from 'utils/formatters';
import { maybeToString } from 'utils/strings';
import { isEmptyOrNil } from 'utils/helpers';

const parseToUnix = compose<string, Date, number, string>(
  maybeToString,
  getUnixTime,
  parseJSON
);

interface ArtworkCardSearchPricesProps {
  auction: AlgoliaAuction;
  artwork: AlgoliaArtwork;
}

export default function ArtworkCardSearchPrices(
  props: ArtworkCardSearchPricesProps
): JSX.Element {
  const { auction, artwork } = props;

  const auctionStatus = auction?.status;
  const isAuctionCanceled = auctionStatus === AlgoliaAuctionStatus.CANCELED;

  const { countdownParts, hasEnded } = useCountdown(
    parseToUnix(auction?.endsAt)
  );

  if (!auctionStatus || isAuctionCanceled) {
    return (
      <ArtworkPriceContainer>
        <ArtworkCardMeta label="Reserve price" value="—" />
      </ArtworkPriceContainer>
    );
  }

  if (
    artwork.availability !== AlgoliaArtworkAvailability.LIVE_AUCTION &&
    auction.status === AlgoliaAuctionStatus.OPEN
  ) {
    return (
      <ArtworkPriceContainer>
        <ArtworkCardMeta
          label="Reserve price"
          value={formatETHWithSuffix(auction.currentPrice)}
        />
      </ArtworkPriceContainer>
    );
  }

  if (hasEnded || auction.status === AlgoliaAuctionStatus.FINALIZED) {
    return (
      <ArtworkPriceContainer>
        <ArtworkCardMeta
          label="Sold for"
          value={formatETHWithSuffix(auction.currentPrice)}
        />
      </ArtworkPriceContainer>
    );
  }

  if (artwork.availability === AlgoliaArtworkAvailability.LIVE_AUCTION) {
    return (
      <ArtworkPriceContainer isLive>
        <ArtworkCardMeta
          label="Current bid"
          value={formatETHWithSuffix(auction.currentPrice)}
        />
        <ArtworkCardMeta
          label="Ending in"
          value={<ArtworkCardCountdown formattedParts={countdownParts} />}
        />
      </ArtworkPriceContainer>
    );
  }

  if (auction.status === AlgoliaAuctionStatus.OPEN) {
    return (
      <ArtworkPriceContainer>
        <ArtworkCardMeta
          label="Reserve price"
          value={formatETHWithSuffix(auction.currentPrice)}
        />
      </ArtworkPriceContainer>
    );
  }

  return null;
}

interface ArtworkCardMetaProps {
  label: string;
  value: ReactNode;
}

function ArtworkCardMeta(props: ArtworkCardMetaProps): JSX.Element {
  const { label, value } = props;
  return (
    <Grid css={{ gap: '$1' }}>
      <ArtworkPriceLabel>{label}</ArtworkPriceLabel>
      <ArtworkPriceValue>{value}</ArtworkPriceValue>
    </Grid>
  );
}

const ArtworkPriceValue = styled(Text, {
  fontSize: '$2',
  fontWeight: 600,
  fontFamily: '$body',
});

const ArtworkPriceLabel = styled(ArtworkPriceValue, {
  color: '$black50',
});

const ArtworkPriceContainer = styled(Box, {
  backgroundColor: '$white100',
  paddingX: '$6',
  paddingY: '$4',
  variants: {
    isLive: {
      true: {
        backgroundColor: '$black100',
        color: '$white100',
        display: 'flex',
        gap: '$4',
      },
    },
  },
});

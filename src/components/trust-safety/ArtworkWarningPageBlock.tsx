/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { cond, equals, always } from 'ramda';

import ModerationStatus from 'types/ModerationStatus';
import { BasicArtwork } from 'types/Artwork';

import ArtworkSuspended from './ArtworkSuspended';
import ArtworkUnderReview from './ArtworkUnderReview';
import Page from 'components/Page';
import ArtworkDMCANotice from './ArtworkDMCANotice';

const renderArtworkWarningPageBlock = cond<BasicArtwork, JSX.Element>([
  [
    (artwork) => equals(artwork.moderationStatus, ModerationStatus.Suspended),
    always(
      <Page title="Artwork Suspended">
        <ArtworkSuspended />
      </Page>
    ),
  ],
  [
    (artwork) => equals(artwork.moderationStatus, ModerationStatus.UnderReview),
    always(
      <Page title="Artwork Under Review">
        <ArtworkUnderReview />
      </Page>
    ),
  ],
  [
    (artwork) =>
      equals(artwork.moderationStatus, ModerationStatus.TakedownRequested),
    (artwork) => (
      <Page title="DMCA Takedown Notice">
        <ArtworkDMCANotice artwork={artwork} />
      </Page>
    ),
  ],
]);

export default renderArtworkWarningPageBlock;

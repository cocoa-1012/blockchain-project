/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { cond, equals, always, T } from 'ramda';

import ModerationStatus from 'types/ModerationStatus';

import ArtworkSuspended from './ArtworkSuspended';
import ArtworkUnderReview from './ArtworkUnderReview';
import ArtworkDMCANotice from './ArtworkDMCANotice';
import Artwork from 'types/Artwork';

const renderArtworkWarningBlock = cond<Artwork, JSX.Element>([
  [
    (artwork) => equals(artwork.moderationStatus, ModerationStatus.Suspended),
    always(<ArtworkSuspended />),
  ],
  [
    (artwork) => equals(artwork.moderationStatus, ModerationStatus.UnderReview),
    always(<ArtworkUnderReview />),
  ],
  [
    (artwork) =>
      equals(artwork.moderationStatus, ModerationStatus.TakedownRequested),
    (artwork) => <ArtworkDMCANotice artwork={artwork} />,
  ],
  [T, () => null],
]);

export default renderArtworkWarningBlock;

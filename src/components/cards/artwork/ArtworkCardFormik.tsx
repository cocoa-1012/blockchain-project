/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { useFormikContext } from 'formik';

import GraySquare from 'components/GraySquare';
import UserTagRaw from 'components/users/UserTagRaw';
import ArtworkCardTitle from 'components/cards/artwork/subcomponents/ArtworkCardTitle';
import ArtworkCardMedia from 'components/cards/artwork/subcomponents/ArtworkCardMedia';
import ArtworkCardTitleContainer from 'components/cards/artwork/subcomponents/ArtworkCardTitleContainer';
import ArtworkCardOptimizing from 'components/cards/artwork/subcomponents/ArtworkCardOptimizing';
import { getArtworkCardStyles } from 'components/cards/artwork/ArtworkCard';

import Account from 'types/Account';
import Artwork, { BasicArtwork } from 'types/Artwork';
import { pointerEventsNone } from 'types/styles';

import {
  buildArtworkCardDashboardUrl,
  buildPosterUrl,
  hasVideoAssetProcessingStatus,
} from 'utils/assets';
import { notEmptyOrNil } from 'utils/helpers';
import { ArtworkCardSkeletonMinimal } from './ArtworkCardSkeleton';
import { UserFragment } from 'graphql/hasura/hasura-fragments.generated';

interface ArtworkCardFormikValues {
  name: string;
}
interface ArtworkCardFormikProps {
  creator: UserFragment;
  artwork: BasicArtwork;
}

export default function ArtworkCardFormik(
  props: ArtworkCardFormikProps
): JSX.Element {
  const { creator, artwork } = props;

  const sx = getArtworkCardStyles();

  const { values } = useFormikContext<ArtworkCardFormikValues>();

  const hasName = notEmptyOrNil(values.name);

  if (!artwork) {
    return <ArtworkCardSkeletonMinimal />;
  }

  const assetUrl = buildArtworkCardDashboardUrl(artwork);
  const posterUrl = buildPosterUrl(artwork);
  const isVideoAssetPending = hasVideoAssetProcessingStatus(artwork);

  return (
    <Box sx={{ ...sx.card, pointerEvents: pointerEventsNone }}>
      <Box sx={{ position: 'relative' }}>
        <ArtworkCardOptimizing
          isVisible={isVideoAssetPending}
          sx={{ top: 'm', left: 'm' }}
        />

        <ArtworkCardMedia assetUrl={assetUrl} posterUrl={posterUrl} />
      </Box>

      <ArtworkCardTitleContainer>
        {hasName ? (
          <ArtworkCardTitle>{values.name}</ArtworkCardTitle>
        ) : (
          <GraySquare sx={{ height: 29, width: 240 }} />
        )}
        <UserTagRaw user={creator} sx={{ marginTop: 'auto' }} />
      </ArtworkCardTitleContainer>
    </Box>
  );
}

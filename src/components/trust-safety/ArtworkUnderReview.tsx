/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import WarningBlock from './WarningBlock';

import ModerationStatus from 'types/ModerationStatus';
import WarningTermsLink from './WarningTermsLink';

export default function ArtworkUnderReview(): JSX.Element {
  return (
    <WarningBlock
      title="This artwork is under review"
      description={
        <>
          This artwork is currently under review by the Foundation team to
          ensure it has not violated the Foundation <WarningTermsLink />.
        </>
      }
      icon={ModerationStatus.UnderReview}
    />
  );
}

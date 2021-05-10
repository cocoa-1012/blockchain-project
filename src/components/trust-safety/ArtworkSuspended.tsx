/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import WarningBlock from './WarningBlock';

import ModerationStatus from 'types/ModerationStatus';
import WarningTermsLink from './WarningTermsLink';

export default function ArtworkRemoved(): JSX.Element {
  return (
    <WarningBlock
      title="This artwork has been permanently removed."
      description={
        <>
          This artwork was found to be in violation of the Foundation{' '}
          <WarningTermsLink /> and has been permanently removed.
        </>
      }
      icon={ModerationStatus.Suspended}
    />
  );
}

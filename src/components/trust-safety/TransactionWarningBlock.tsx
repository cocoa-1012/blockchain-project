/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { Grid, jsx, Box } from 'theme-ui';
import { cond, equals, always } from 'ramda';

import ModerationStatus from 'types/ModerationStatus';

import WarningBlock from './WarningBlock';
import WarningTermsLink from './WarningTermsLink';

const renderTransactionWarningBlock = cond<ModerationStatus, JSX.Element>([
  [
    equals(ModerationStatus.Suspended),
    always(
      <WarningBlock
        title="Your profile has been permanently removed."
        description={
          <Grid gap="l">
            <Box>
              Your profile has been found to be in violation of the Foundation
              <WarningTermsLink /> and permanently suspended. You can no longer
              mint any new NFTs.
            </Box>
          </Grid>
        }
        icon={ModerationStatus.Suspended}
      />
    ),
  ],
  [
    equals(ModerationStatus.UnderReview),
    always(
      <WarningBlock
        title="Your profile is under review."
        description={
          <Grid gap="l">
            <Box>
              Your profile is currently under review by the Foundation team, to
              ensure it has not broken the Foundation <WarningTermsLink />. You
              will not be able to mint any new NFTs at this time.
            </Box>
          </Grid>
        }
        icon={ModerationStatus.UnderReview}
      />
    ),
  ],
]);

export default renderTransactionWarningBlock;

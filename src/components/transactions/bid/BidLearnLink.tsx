/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import ExternalLink from 'components/links/ExternalLink';

export default function BidLearnLink(): JSX.Element {
  return (
    <ExternalLink
      href="https://help.foundation.app/en/articles/4742997-a-complete-guide-to-collecting-nfts-and-how-auctions-work"
      sx={{ fontWeight: 600, color: 'black.60', textAlign: 'center' }}
      variant="body.body"
    >
      Learn how our auctions work.
    </ExternalLink>
  );
}

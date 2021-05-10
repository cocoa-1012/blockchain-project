/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import InternalInlineLink from 'components/links/InternalInlineLink';

export default function WarningTermsLink(): JSX.Element {
  return (
    <InternalInlineLink href="/terms">Terms of Service</InternalInlineLink>
  );
}

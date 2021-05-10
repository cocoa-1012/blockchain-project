/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import VerifySocialBlockCustomRedirect from 'components/trust-safety/VerifySocialBlockCustomRedirect';
import { useRouter } from 'next/router';
import { getFirstValue } from 'utils/helpers';
import Page from 'components/Page';

export default function VerifySocialBlockPage(props): JSX.Element {
  const router = useRouter();
  const redirectPath = getFirstValue(router.query['redirect-path']);
  return (
    <Page title="Verify Profile">
      <VerifySocialBlockCustomRedirect redirectPath={redirectPath} />
    </Page>
  );
}

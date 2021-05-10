/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import Page from 'components/Page';
import Body from 'components/Body';
import SpinnerStroked from 'components/SpinnerStroked';

import { positionRelative } from 'types/styles';
import { PageTypes } from 'types/page';

import useAuthToken from 'hooks/queries/use-auth-token';

export default function Account(): JSX.Element {
  const { user } = useAuthToken();

  const router = useRouter();

  const publicAddress = user?.publicAddress;

  useEffect(() => {
    if (publicAddress) {
      router.push(`/${publicAddress}`);
    }
  }, [publicAddress]);

  return (
    <Page title="Redirecting to profile…" type={PageTypes.auth}>
      <Body
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'auto',
          position: positionRelative,
          zIndex: 4,
          paddingY: ['xxl', null, 'xxxl'],
        }}
      >
        <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <SpinnerStroked size={62} />
        </Flex>
      </Body>
    </Page>
  );
}

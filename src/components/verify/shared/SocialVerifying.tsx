/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, Grid, Heading } from 'theme-ui';

import { VerificationLaterStateContainer } from 'components/verify/VerificationContainer';
import SpinnerStroked from 'components/SpinnerStroked';
import { ServiceName } from 'types/SocialVerification';
import Image from 'next/image';

interface SocialVerifyingProps {
  serviceName?: ServiceName;
}

export default function SocialVerifying({
  serviceName = ServiceName.TWITTER,
}: SocialVerifyingProps): JSX.Element {
  return (
    <VerificationLaterStateContainer>
      <Box>
        <Grid gap="s">
          {/* TODO: Add Twitter icon here */}
          {/* {serviceName === ServiceName.INSTAGRAM && (
            <Image
              src="/images/Instagram.png"
              alt="Instagram"
              width="80"
              height="80"
            />
          )} */}
          <Heading
            variant="h.xl"
            sx={{ marginBottom: 'xl', maxWidth: 500, textAlign: 'center' }}
          >
            Your {serviceName} profile is being verified…
          </Heading>
          <Flex sx={{ justifyContent: 'center' }}>
            <SpinnerStroked size={62} />
          </Flex>
        </Grid>
      </Box>
    </VerificationLaterStateContainer>
  );
}

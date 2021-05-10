/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Button, Heading, Text, Flex } from 'theme-ui';

import { VerificationLaterStateContainer } from 'components/verify/VerificationContainer';
import { ServiceName } from 'types/SocialVerification';
import Image from 'next/image';

interface SocialSuccessProps {
  usernameOrPublicKey: string;
  redirectPath: string;
  serviceName?: string;
}

export default function SocialSuccess({
  usernameOrPublicKey,
  redirectPath,
  serviceName = 'Twitter',
}: SocialSuccessProps): JSX.Element {
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
          <Flex sx={{ justifyContent: 'center' }}>
            <Heading
              variant="h.xl"
              sx={{
                marginBottom: 's',
                maxWidth: 640,
                textAlign: 'center',
              }}
            >
              Your profile has been verified via {serviceName}!
            </Heading>
          </Flex>

          <Grid sx={{ maxWidth: 260, marginX: 'auto', gap: 'l' }}>
            <Text variant="body.body" sx={{ textAlign: 'center' }}>
              You’ve successfully verified your {serviceName} profile on
              Foundation.
            </Text>

            <a href={redirectPath} sx={{ display: 'block' }}>
              <Button
                variant={'primary'}
                type="button"
                sx={{
                  width: '100%',
                  paddingRight: '36px !important',
                }}
              >
                <Text sx={{ marginLeft: 's', position: 'relative', top: -2 }}>
                  Continue
                </Text>
              </Button>
            </a>
          </Grid>
        </Grid>
      </Box>
    </VerificationLaterStateContainer>
  );
}

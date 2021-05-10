/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Heading, Text, Button, Flex } from 'theme-ui';

import { VerificationLaterStateContainer } from 'components/verify/VerificationContainer';
import { ServiceName } from 'types/SocialVerification';
import useDeleteSocialVerification from 'hooks/mutations/server/use-delete-social-verification';
import { useRouter } from 'next/router';
import useAuthToken from 'hooks/queries/use-auth-token';

import { includes } from 'ramda';

interface SocialErrorProps {
  reset?: any;
  serviceName?: ServiceName;
  failedReason?: string;
  redirectPath?: string;
  socialVerificationID?: string;
}

export default function SocialError({
  reset,
  serviceName = ServiceName.TWITTER,
  redirectPath,
  socialVerificationID,
  failedReason,
}: SocialErrorProps): JSX.Element {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useAuthToken();
  const [
    deleteInstagramVerification,
    { loading: instagramLoading },
  ] = useDeleteSocialVerification({
    id: socialVerificationID,
    token: user?.token,
  });

  const failedReasonToShow =
    failedReason && includes('Ethereum address', failedReason)
      ? 'Your Ethereum address needs to be included somewhere in the tweet.'
      : failedReason;

  return (
    <VerificationLaterStateContainer>
      <Box>
        <Grid gap="s">
          <Heading variant="h.xl" sx={{ marginBottom: 's', maxWidth: 500 }}>
            There was an error while verifying your {serviceName} profile.
          </Heading>
          <Text variant="body.body" sx={{ marginBottom: 's', maxWidth: 500 }}>
            Please try again.
          </Text>
          {failedReason && (
            <Text
              variant="body.body"
              sx={{
                marginBottom: 's',
                maxWidth: 500,
                fontFamily: 'mono',
                color: 'utility.red',
                fontSize: 'body',
              }}
            >
              {failedReasonToShow}
            </Text>
          )}
          {serviceName === ServiceName.INSTAGRAM ? (
            <Button
              variant={'primary'}
              type="button"
              sx={{
                width: '100%',
                paddingRight: '36px !important',
              }}
              onClick={async () => {
                if (socialVerificationID) {
                  await deleteInstagramVerification();
                }
                router.push(
                  `/profile/verify/instagram?redirect-path=${redirectPath}`
                );
              }}
            >
              <Text sx={{ marginLeft: 's', position: 'relative', top: -2 }}>
                Retry verification
              </Text>
            </Button>
          ) : (
            <Button
              variant={'primary'}
              type="button"
              sx={{
                width: '100%',
                paddingRight: '36px !important',
              }}
              onClick={reset}
            >
              <Text sx={{ marginLeft: 's', position: 'relative', top: -2 }}>
                Retry verification
              </Text>
            </Button>
          )}
        </Grid>
      </Box>
    </VerificationLaterStateContainer>
  );
}

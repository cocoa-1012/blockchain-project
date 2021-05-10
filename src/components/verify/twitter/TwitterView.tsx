/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Button, Heading, Text } from 'theme-ui';
import { useFormikContext } from 'formik';

import { split } from 'ramda';

import TwitterForm from 'components/verify/twitter/TwitterForm';
import TextField from 'components/forms/fields/TextField';
import SubmitButton from 'components/forms/SubmitButton';
import { VerificationFormContainer } from 'components/verify/VerificationContainer';
import TwitterShareButtonLink from 'components/links/TwitterShareButtonLink';

import { buildVerifyTweet } from 'utils/twitter-templates';

import { TwitterFormValues } from './types';
import SocialVerification from 'types/SocialVerification';

import { getFirstValue, getUsernameOrAddress } from 'utils/helpers';
import useAuthToken from 'hooks/queries/use-auth-token';
import { useValidSocialVerificationTwitterByTwitterUsername } from 'hooks/queries/hasura/use-social-verification';

interface TwitterViewProps {
  onSubmit: (values: TwitterFormValues) => void;
}

export default function TwitterView(props: TwitterViewProps): JSX.Element {
  const { onSubmit } = props;

  const sx = getStyles();

  const { user } = useAuthToken();

  const twitterShareText = buildVerifyTweet({
    creatorName: `${getUsernameOrAddress(user)}`,
    creatorAddress: user?.publicAddress,
    profilePath: `/${getUsernameOrAddress(user)}`,
  });

  return (
    <VerificationFormContainer>
      <TwitterForm
        onSubmit={onSubmit}
        initialValues={{
          tweetURL: '',
        }}
      >
        <Grid gap="l">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Heading variant="h.xl" sx={{ marginBottom: 'l' }}>
              Verify your profile via Twitter
            </Heading>
          </Box>
          <Box sx={sx.form}>
            <Box
              sx={{
                paddingX: 'xxl',
                marginBottom: 'l',
                borderBottom: 'solid 1px',
                borderColor: 'black.5',
              }}
            >
              <Text
                variant="h.xs"
                sx={{ color: 'black.50', marginBottom: 's' }}
              >
                Step One
              </Text>
              <Grid gap="m" columns={[1, null, '2fr 1fr']}>
                <Box sx={{ marginBottom: 'xl', maxWidth: 370 }}>
                  <Heading
                    variant="h.s"
                    sx={{ marginBottom: 's', maxWidth: 370 }}
                  >
                    Post a public tweet that contains your wallet address.
                  </Heading>
                  <Text variant="body.body" sx={{ marginBottom: 'xs' }}>
                    Your wallet address is
                  </Text>
                  <Text>{user?.publicAddress}</Text>
                </Box>
                <Box>
                  <TwitterShareButtonLink
                    twitterShareText={twitterShareText}
                    text={'Post Tweet'}
                  />
                </Box>
              </Grid>
            </Box>
            <Box sx={{ paddingX: 'xxl' }}>
              <Text
                variant="h.xs"
                sx={{ color: 'black.50', marginBottom: 's' }}
              >
                Step Two
              </Text>
              <Heading variant="h.s" sx={{ marginBottom: 'xl', maxWidth: 330 }}>
                Paste the URL of the tweet to verify your profile.
              </Heading>
            </Box>

            <Grid gap="m">
              <Grid sx={{ paddingX: 'xxl' }}>
                <Box>
                  <TextField placeholder="Tweet URL" name="tweetURL" />
                </Box>
              </Grid>
              <Box sx={{ paddingX: 'xxl' }}>
                <TwitterViewSubmitButtonContainer
                  publicAddress={user?.publicAddress}
                />
              </Box>
            </Grid>
          </Box>
        </Grid>
      </TwitterForm>
    </VerificationFormContainer>
  );
}

function TwitterViewSubmitButtonContainer({
  publicAddress,
}: {
  publicAddress: string;
}): JSX.Element {
  const { values, isSubmitting } = useFormikContext<TwitterFormValues>();

  const sx = getStyles();

  const tweetURL = values?.tweetURL;

  const firstHalfOfURLParts = split('/status', tweetURL);
  const firstHalfOfURL = firstHalfOfURLParts[0];

  const handleFromURLParts = split('twitter.com/', firstHalfOfURL);
  const handleFromURL = handleFromURLParts[1];

  // TODO: Only have it enabled when tweetURL is defined

  const { data: duplicateSocialVerificationData } =
    useValidSocialVerificationTwitterByTwitterUsername({
      username: handleFromURL,
      skip: !handleFromURL,
    });

  const duplicateSocialVerification: SocialVerification = getFirstValue(
    duplicateSocialVerificationData?.socialVerifications
  );

  const twitterHandle = duplicateSocialVerification?.username;

  const socialVerificationUsedAlready =
    !!handleFromURL && handleFromURL === twitterHandle;

  if (isSubmitting) {
    return (
      <Button disabled sx={{ width: '100%' }}>
        Confirm
      </Button>
    );
  }

  if (socialVerificationUsedAlready) {
    return (
      <Box sx={sx.grayBox}>
        <Heading variant="h.s" sx={{ marginBottom: 'm' }}>
          This Twitter profile is already being used to verify another
          Foundation profile.
        </Heading>
        <Text variant="body.body" sx={{ marginBottom: 'm' }}>
          If you continue, the Twitter verification will be removed from the
          original profile and applied to your current profile.
        </Text>
        <SubmitButton sx={{ width: '100%' }} disableIfInvalid>
          Confirm
        </SubmitButton>
      </Box>
    );
  }

  return (
    <SubmitButton sx={{ width: '100%' }} disableIfInvalid>
      Confirm
    </SubmitButton>
  );
}

const getStyles = () => ({
  form: {
    paddingY: 'xxl',
    boxShadow: 's',
    borderRadius: 10,
    backgroundColor: 'white.100',
  },
  grayBox: {
    paddingY: 'xxl',
    paddingX: 'xxl',
    borderRadius: 10,
    backgroundColor: 'black.5',
  },
});

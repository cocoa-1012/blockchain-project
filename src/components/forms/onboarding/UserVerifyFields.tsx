/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Flex, Box, Grid } from 'theme-ui';
import { PureQueryOptions } from '@apollo/client';
import { useRouter } from 'next/router';

import TwitterIcon from 'assets/icons/twitter-icon.svg';
import InstagramIcon from 'assets/icons/instagram-icon.svg';

import { buildSocialLink } from 'utils/urls';
import { maybeGetAddress } from 'utils/users';

import FormBlock from 'components/forms/FormBlock';
import TwitterVerifyLink from 'components/links/SocialVerifyLink';
import InstagramVerifyPageLink from 'components/links/InstagramVerifyPageLink';
import { SocialLinkRemoveable } from 'components/profiles/SocialLinkVerified';

import SocialVerification from 'types/SocialVerification';
import useDeleteSocialVerification from 'hooks/mutations/server/use-delete-social-verification';

import {
  GET_HASURA_VALID_SOCIAL_VERIFICATIONS_TWITTER_BY_PUBLIC_KEY,
  GET_HASURA_VALID_SOCIAL_VERIFICATIONS_INSTAGRAM_BY_PUBLIC_KEY,
} from 'queries/hasura/socialVerification';
import { VariantOptions } from 'types/ButtonVariantOptions';
import { BUTTON_WIDTH } from 'utils/buttons';

interface UserVerifyFieldsProps {
  twitterSocialVerification: SocialVerification;
  instagramSocialVerification: SocialVerification;
  token: string;
  publicAddress: string;
}

export default function UserVerifyFields(
  props: UserVerifyFieldsProps
): JSX.Element {
  const {
    twitterSocialVerification,
    instagramSocialVerification,
    token,
    publicAddress,
  } = props;

  const router = useRouter();

  const isTwitterUsernameValid = twitterSocialVerification?.isValid;
  const twitterUsername = twitterSocialVerification?.username;
  const isInstagramUsernameValid = instagramSocialVerification?.isValid;
  const instagramUsername = instagramSocialVerification?.username;

  const refetchQueriesTwitter: PureQueryOptions[] = [
    {
      query: GET_HASURA_VALID_SOCIAL_VERIFICATIONS_TWITTER_BY_PUBLIC_KEY,
      variables: { publicKey: maybeGetAddress(publicAddress) },
      context: { endpoint: 'hasura' },
    },
  ];

  const refetchQueriesInstagram: PureQueryOptions[] = [
    {
      query: GET_HASURA_VALID_SOCIAL_VERIFICATIONS_INSTAGRAM_BY_PUBLIC_KEY,
      variables: { publicKey: maybeGetAddress(publicAddress) },
      context: { endpoint: 'hasura' },
    },
  ];

  // TODO: Add support for Instagram here too
  const [
    deleteTwitterVerification,
    { loading: twitterLoading },
  ] = useDeleteSocialVerification({
    id: twitterSocialVerification?.id,
    token,
    refetchQueries: refetchQueriesTwitter,
  });

  const [
    deleteInstagramVerification,
    { loading: instagramLoading },
  ] = useDeleteSocialVerification({
    id: instagramSocialVerification?.id,
    token,
    refetchQueries: refetchQueriesInstagram,
  });

  return (
    <FormBlock
      title="Verify your profile"
      shouldShowBadge={true}
      hintText={
        <Text variant="body.body" sx={{ marginBottom: ['m', null, 0] }}>
          Show the Foundation community that your profile is authentic.
        </Text>
      }
    >
      <Grid gap="s">
        {isTwitterUsernameValid ? (
          <Flex sx={{ justifyContent: [null, null, 'flex-end'] }}>
            <SocialLinkRemoveable
              icon={
                <Flex sx={{ width: 19 }}>
                  <TwitterIcon
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </Flex>
              }
              handle={twitterUsername}
              linkBuilderFn={buildSocialLink.twitter}
              isLoading={twitterLoading}
              onClick={deleteTwitterVerification}
            >
              @{twitterUsername}
            </SocialLinkRemoveable>
          </Flex>
        ) : (
          <Flex sx={{ justifyContent: [null, null, 'flex-end'] }}>
            <Box sx={{ width: BUTTON_WIDTH }}>
              <TwitterVerifyLink
                text="Verify via Twitter"
                redirectPath={router.asPath}
                variant={VariantOptions.ghostGraySmall}
              />
            </Box>
          </Flex>
        )}
        {isInstagramUsernameValid ? (
          <Flex sx={{ justifyContent: [null, null, 'flex-end'] }}>
            <SocialLinkRemoveable
              icon={
                <Flex sx={{ width: 19 }}>
                  <InstagramIcon
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </Flex>
              }
              handle={instagramUsername}
              linkBuilderFn={buildSocialLink.instagram}
              isLoading={instagramLoading}
              onClick={deleteInstagramVerification}
            >
              {instagramUsername}
            </SocialLinkRemoveable>
          </Flex>
        ) : (
          <Flex sx={{ justifyContent: [null, null, 'flex-end'] }}>
            <Box sx={{ width: BUTTON_WIDTH }}>
              <InstagramVerifyPageLink
                text="Verify via Instagram"
                redirectPath={router.asPath}
                variant={VariantOptions.ghostGraySmall}
              />
            </Box>
          </Flex>
        )}
      </Grid>
    </FormBlock>
  );
}

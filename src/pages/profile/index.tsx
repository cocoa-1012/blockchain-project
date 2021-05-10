/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Box } from 'theme-ui';
import { Global, css } from '@emotion/core';
import { Formik, Form } from 'formik';
import { ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';

import useAuthToken from 'hooks/queries/use-auth-token';
import useUpsertUser from 'hooks/mutations/use-upsert-user';
import { useUserWithEmailByPublicKey } from 'hooks/queries/use-user-by-public-key';
import {
  useValidSocialVerificationTwitter,
  useValidSocialVerificationInstagram,
} from 'hooks/queries/hasura/use-social-verification';

import { PageTypes } from 'types/page';

import { mergeSocialLinks, socialLinks } from 'utils/social-links';
import { maybeLowerCase } from 'utils/case';
import { getFirstValue } from 'utils/helpers';
import { DEFAULT_PROVIDER_TYPE } from 'lib/constants';

import { createUserSchema } from 'schemas/user';

import UserFormFields from 'components/forms/onboarding/UserFormFields';
import FormContainer from 'components/forms/FormContainer';
import FormHeading from 'components/forms/FormHeading';
import FormGrid from 'components/forms/FormGrid';
import Page from 'components/Page';
import Body from 'components/Body';
import SubmitButton from 'components/forms/SubmitButton';
import LoadingPage from 'components/LoadingPage';

export default function Profile(): JSX.Element {
  const { user, isLoading: isUserLoading } = useAuthToken();

  const {
    data,
    isLoading: isUserWithEmailLoading,
  } = useUserWithEmailByPublicKey(user?.publicAddress, user?.token);

  const router = useRouter();

  const {
    data: socialVerificationDataTwitter,
  } = useValidSocialVerificationTwitter({
    publicKey: user?.publicAddress,
  });

  const twitterSocialVerification = getFirstValue(
    socialVerificationDataTwitter?.socialVerifications
  );

  const {
    data: socialVerificationDataInsta,
  } = useValidSocialVerificationInstagram({
    publicKey: user?.publicAddress,
  });

  const instagramSocialVerification = getFirstValue(
    socialVerificationDataInsta?.socialVerifications
  );

  const userData = data?.user;

  const publicAddress = user?.publicAddress;
  const token = user?.token;
  const username = userData?.username;

  const pageCopy = {
    title: 'Edit your Profile',
    action: 'Save Changes',
    submittingText: 'Saving Changes…',
  };

  const { mutateAsync: upsertUser } = useUpsertUser(publicAddress);

  const redirectToProfile = useCallback(
    async (username) => await router.push(`/${maybeLowerCase(username)}`),
    [router]
  );

  const handleSubmit = useCallback(
    async (values) => {
      const { token, ...formValues } = values;
      try {
        await upsertUser({ data: formValues, token });
        await redirectToProfile(formValues.username);
      } catch (err) {
        console.log('Error');
      }
    },
    [upsertUser, redirectToProfile]
  );

  if (isUserLoading || isUserWithEmailLoading || !userData) {
    return (
      <>
        <Global
          styles={css`
            body {
              background-color: #f2f2f2;
            }
          `}
        />
        <Page title="Profile" type={PageTypes.auth}>
          <LoadingPage />
        </Page>
      </>
    );
  }

  return (
    <PageContainer>
      <FormHeading>{pageCopy.title}</FormHeading>
      <FormGrid>
        <FormContainer>
          <Formik
            initialValues={{
              token,
              name: userData?.name ?? '',
              email: userData?.email ?? '',
              providerType: userData?.providerType ?? DEFAULT_PROVIDER_TYPE,
              username: userData?.username ?? '',
              bio: userData?.bio ?? '',
              coverImageUrl: userData?.coverImageUrl ?? '',
              profileImageUrl: userData?.profileImageUrl ?? '',
              links: mergeSocialLinks(socialLinks, userData?.links),
            }}
            validationSchema={createUserSchema({ currentUsername: username })}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid gap={['l', null, null, null, 'xxl']}>
                <UserFormFields
                  token={token}
                  twitterSocialVerification={twitterSocialVerification}
                  instagramSocialVerification={instagramSocialVerification}
                  publicAddress={publicAddress}
                />
              </Grid>
              <Box sx={{ paddingTop: 'l' }}>
                <SubmitButton
                  submittingText={pageCopy.submittingText}
                  disableIfInvalid
                  sx={{ width: '100%' }}
                >
                  {pageCopy.action}
                </SubmitButton>
              </Box>
            </Form>
          </Formik>
        </FormContainer>
      </FormGrid>
    </PageContainer>
  );
}

interface PageContainerProps {
  children: ReactNode | ReactNode[];
}

function PageContainer({ children }: PageContainerProps): JSX.Element {
  return (
    <>
      <Global
        styles={css`
          body {
            background-color: #f2f2f2;
          }
        `}
      />

      <Page title="Profile" type={PageTypes.auth}>
        <Body>{children}</Body>
      </Page>
    </>
  );
}

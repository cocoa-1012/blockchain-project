/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-lines */
import { useCallback } from 'react';
import { Form } from 'formik';
import { Global, css } from '@emotion/react';

import { MailchimpSchema } from 'schemas/mailchimp';

import Page from 'components/Page';
import Body from 'components/base/Body';
import Box from 'components/base/Box';
import Label from 'components/forms/Label';
import Divider from 'components/Divider';
import FormHeading from 'components/forms/FormHeading';
import TextField from 'components/forms/fields/TextField';
import Grid from 'components/base/Grid';
import CheckboxAndWrapper from 'components/forms/CheckboxAndWrapper';
import FormikSubmitButton from 'components/forms/FormikSubmitButton';
import LoadingPage from 'components/LoadingPage';
import FormikForm from 'components/forms/FormikForm';

import useAuthToken from 'hooks/queries/use-auth-token';
import useUserSettings from 'hooks/queries/hasura/use-user-settings';
import useUpdateUserSettings from 'hooks/mutations/server/use-update-user-settings';
import useUpsertUser from 'hooks/mutations/use-upsert-user';
import { useUserEmailByPublicKey } from 'hooks/queries/use-user-by-public-key';

import { EmailSettings } from 'types/Account';

import { DEFAULT_PROVIDER_TYPE } from 'lib/constants';

import { isAnyTrue } from 'utils/helpers';

interface SettingsFormValues extends EmailSettings {
  auctions: boolean;
  newNFT: boolean;
  email: string;
}

export default function Settings(): JSX.Element {
  const { user, isLoading: isUserLoading } = useAuthToken();

  const publicAddress = user?.publicAddress;
  const token = user?.token;

  const {
    data: userSettingsData,
    isLoading: isSettingsLoading,
    refetch: refetchSettings,
  } = useUserSettings({
    publicKey: publicAddress,
  });

  const emailSettings = userSettingsData?.user?.emailSettings;

  const {
    data: userData,
    isLoading: userDataLoading,
  } = useUserEmailByPublicKey(publicAddress, token);

  const { mutateAsync: upsertUser } = useUpsertUser(publicAddress);
  const { mutateAsync: updateSettings } = useUpdateUserSettings();

  const handleSubmit = useCallback(
    async (values: SettingsFormValues): Promise<void> => {
      try {
        // Update the user’s email
        await upsertUser({
          token,
          data: {
            email: values.email,
            providerType: DEFAULT_PROVIDER_TYPE,
          },
        });
        await updateSettings({
          token,
          publicKey: publicAddress,
          data: {
            newNFT: values.newNFT,
            auctions: values.auctions,
          },
        });
        await refetchSettings();
      } catch (err) {
        console.log('Error');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateSettings, upsertUser, publicAddress, token]
  );

  const isLoading = isAnyTrue([
    userDataLoading,
    isUserLoading,
    isSettingsLoading,
  ]);

  if (isLoading || !user) {
    return (
      <Page title="Settings">
        <LoadingPage />
      </Page>
    );
  }

  return (
    <Page title="Settings">
      <Body css={{ fontFamily: '$body', paddingX: '$3' }}>
        <Global
          styles={css`
            body {
              background-color: #f2f2f2;
            }
          `}
        />
        <FormHeading>Settings</FormHeading>
        <Box
          css={{
            marginY: '$8',
            marginX: 'auto',
            backgroundColor: '$white100',
            borderRadius: '$3',
            boxShadow: '$0',
            maxWidth: 720,
            '@bp1': {
              marginY: '$10',
            },
          }}
        >
          <FormikForm
            initialValues={{
              auctions: emailSettings?.auctions ?? false,
              newNFT: emailSettings?.newNFT ?? false,
              email: userData?.user?.email ?? '',
            }}
            validationSchema={MailchimpSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid
                css={{
                  alignItems: 'center',
                  paddingX: '$5',
                  paddingY: '$7',
                  gridRowGap: '$5',
                  '@bp1': {
                    gridTemplateColumns: '1fr 1fr',
                    padding: '$8',
                  },
                }}
              >
                <Label>Your email address</Label>
                <TextField
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                />
              </Grid>
              <Divider />
              <Box
                css={{
                  paddingX: '$5',
                  paddingY: '$7',
                  '@bp1': {
                    padding: '$8',
                  },
                }}
              >
                <Label as="h2">Email notifications</Label>
                <Grid css={{ gridRowGap: '$3', marginTop: '$6' }}>
                  <CheckboxAndWrapper
                    name="auctions"
                    label="Auction Notifications"
                    description="Receive email notifications when bids you place are confirmed, when you have been outbid and when an auction has ended."
                  />
                  <CheckboxAndWrapper
                    name="newNFT"
                    label="New NFT Listings"
                    description="Receive email notifications when profiles that you follow list a new NFT on Foundation."
                  />
                </Grid>
              </Box>
              <Box
                css={{
                  paddingX: '$5',
                  paddingBottom: '$4',
                  '@bp1': {
                    paddingX: '$8',
                    paddingBottom: '$8',
                  },
                }}
              >
                <FormikSubmitButton
                  label="Save Changes"
                  submittingLabel="Saving…"
                  submittedLabel="Saved!"
                />
              </Box>
            </Form>
          </FormikForm>
        </Box>
      </Body>
    </Page>
  );
}

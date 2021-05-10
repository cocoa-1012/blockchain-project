/* eslint-disable react/jsx-max-depth */
import React, { useCallback } from 'react';
import { Global, css } from '@emotion/react';
import { Form } from 'formik';
import qs from 'qs';
import jsonp from 'jsonp';

import Page from 'components/Page';
import Body from 'components/base/Body';
import Heading from 'components/brand/Heading';
import Box from 'components/base/Box';
import TextField from 'components/forms/fields/TextField';
import Grid from 'components/base/Grid';
import Label from 'components/forms/Label';
import Divider from 'components/Divider';
import NewsletterSetting from 'components/settings/NewsletterSetting';
import Image from 'components/base/Image';
import FormikSubmitButton from 'components/forms/FormikSubmitButton';
import FormikForm from 'components/forms/FormikForm';

import { PageColorMode } from 'types/page';
import { PageTypes } from 'types/page';

import { NewsletterSchema } from 'schemas/newsletter';

import { FORM_URL } from 'lib/constants';

interface FormValues {
  email: string;
}

export default function Newsletters(): JSX.Element {
  const handleSubmit = useCallback(
    async (values: FormValues, { setErrors }) => {
      const formData = qs.stringify({
        EMAIL: values.email,
      });

      const formParams = {
        param: 'c',
      };

      const formUrl = `${FORM_URL}&${formData}`;

      await new Promise((resolve, reject) => {
        jsonp(formUrl, formParams, (error, data) => {
          const isError = error || !data;
          if (isError) {
            setErrors({
              email: 'There was an error, please try again.',
            });
            reject('error');
          } else {
            resolve('success');
          }
        });
      });
    },
    []
  );

  return (
    <Page
      title="Newsletters"
      type={PageTypes.maximal}
      headerMode={PageColorMode.dark}
    >
      <Global
        styles={css`
          body {
            background-color: #000fff;
          }
        `}
      />
      <Body css={{ fontFamily: '$body', paddingX: '$3' }}>
        <Heading
          css={{ textAlign: 'center', marginY: '$11', position: 'relative' }}
        >
          <Image
            src="/images/svg-text/newsletters.svg"
            alt="newsletters"
            css={{ maxWidth: '90%' }}
          />
          <Image
            src="/images/at.webp"
            alt="@"
            css={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: -1,
            }}
          />
        </Heading>
        <Box
          css={{
            marginY: '$8',
            marginX: 'auto',
            backgroundColor: '$white100',
            borderRadius: '$3',
            boxShadow: '$0',
            maxWidth: 720,

            '@bp1': {
              marginY: '$11',
            },
          }}
        >
          <FormikForm
            initialValues={{ email: '', weeklyNewsletter: false }}
            validationSchema={NewsletterSchema}
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
                <TextField name="email" placeholder="Email" type="email" />
              </Grid>
              <Divider />
              <Box
                css={{
                  paddingX: '$5',
                  paddingBottom: '$4',
                  '@bp1': {
                    paddingX: '$8',
                    paddingBottom: '$8',
                    paddingTop: '$5',
                  },
                }}
              >
                <Grid css={{ gridRowGap: '$3', marginTop: '$6' }}>
                  <NewsletterSetting
                    label="Weekly Newsletter"
                    name="weeklyNewsletter"
                    description="Find art in your inbox every Wednesday. Interviews, events, and updates from the Foundation community and beyond."
                    publicKey="0x5BDdCd826CFccC4a88A2ED5bA98c44d8aD982113"
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
                  label="Subscribe"
                  submittingLabel="Saving…"
                  submittedLabel="Subscribed!"
                />
              </Box>
            </Form>
          </FormikForm>
        </Box>
      </Body>
    </Page>
  );
}

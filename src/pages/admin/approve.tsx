/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';
import { Formik, Form } from 'formik';
import { useCallback } from 'react';

import useAuthToken from 'hooks/queries/use-auth-token';
import useApproveAsCreator from 'hooks/mutations/use-approve-as-creator';

import FormContainer from 'components/forms/FormContainer';
import FormHeading from 'components/forms/FormHeading';
import SubmitButton from 'components/forms/SubmitButton';
import TextField from 'components/forms/fields/TextField';
import Page from 'components/Page';
import Body from 'components/Body';

import { positionRelative } from 'types/styles';

export default function ApproveForm(): JSX.Element {
  const { user } = useAuthToken();
  const { mutateAsync: approveAsCreator } = useApproveAsCreator();

  const token = user?.token;
  // TODO: Make sure user is admin. This is guarded on server so mostly a UX improvement.

  const handleSubmit = useCallback(
    async (data) => {
      try {
        await approveAsCreator({ token, data });
      } catch (err) {
        console.log('Error');
      }
    },
    [approveAsCreator, token]
  );

  return (
    <Page title="Approve a Creator">
      <Body sx={{ position: positionRelative, zIndex: 4 }}>
        <FormHeading>Approve a Creator</FormHeading>
        <FormContainer>
          <Formik
            initialValues={{ publicKey: '', email: '' }}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            <Form>
              <Box sx={{ paddingTop: 'l' }}>
                <TextField name="publicKey" placeholder="Ethereum Address" />
              </Box>
              <Box sx={{ paddingTop: 'l' }}>
                <TextField name="email" placeholder="Email Address" />
              </Box>
              <Box sx={{ paddingTop: 'l' }}>
                <SubmitButton
                  submittingText="Approving…"
                  disableIfInvalid
                  sx={{ width: '100%' }}
                >
                  Approve Creator
                </SubmitButton>
              </Box>
            </Form>
          </Formik>
        </FormContainer>
      </Body>
    </Page>
  );
}

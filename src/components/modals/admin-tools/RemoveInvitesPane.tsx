import { Formik, Form } from 'formik';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import CheckboxAndWrapper from 'components/forms/CheckboxAndWrapper';
import FormikSubmitButton from 'components/forms/FormikSubmitButton';

import { propOrEmptyString } from 'utils/strings';

import { useRemoveUnusedInviteCodes } from 'graphql/server/mutations/remove-unused-invite-codes.generated';

import Account from 'types/Account';

interface RemoveInvitesFormValues {
  userPublicKey: string;
  removeInvites: boolean;
}

interface RemoveInvitesPaneProps {
  user: Account;
}

export default function RemoveInvitesPane(
  props: RemoveInvitesPaneProps
): JSX.Element {
  const { user } = props;

  const { mutateAsync: removeUnusedInviteCodes } = useRemoveUnusedInviteCodes();

  const handleSubmit = async (values: RemoveInvitesFormValues) => {
    if (values.removeInvites) {
      await removeUnusedInviteCodes({
        userPublicKey: values.userPublicKey,
      });
    }
  };

  return (
    <Box css={{ padding: '$6' }}>
      <Formik<RemoveInvitesFormValues>
        initialValues={{
          userPublicKey: propOrEmptyString('publicKey')(user),
          removeInvites: false,
        }}
        onSubmit={handleSubmit}
        enableReinitialize={!user}
      >
        <Form>
          <Grid css={{ gap: '$4' }}>
            <CheckboxAndWrapper
              name="removeInvites"
              label="Remove invites"
              description="Should this user’s remaining invites be removed?"
            />

            <FormikSubmitButton
              label="Remove invites"
              submittingLabel="Removing invites…"
              submittedLabel="Invites removed"
            />
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
}

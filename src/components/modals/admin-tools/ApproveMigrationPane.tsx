import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import CheckboxAndWrapper from 'components/forms/CheckboxAndWrapper';
import FormikSubmitButton from 'components/forms/FormikSubmitButton';

import { propOrEmptyString } from 'utils/strings';

import Account from 'types/Account';
import { useUpdateCreatorMigration } from 'graphql/server/mutations/update-creator-migration.generated';

interface ApproveMigrationFormValues {
  userPublicKey: string;
  approveMigration: boolean;
}

interface ApproveMigrationPaneProps {
  user: Account;
}

export default function ApproveMigrationPane(
  props: ApproveMigrationPaneProps
): JSX.Element {
  const { user } = props;

  const { mutateAsync: removeUnusedInviteCodes } = useUpdateCreatorMigration();

  const handleSubmit = async (values: ApproveMigrationFormValues) => {
    if (values.approveMigration) {
      await removeUnusedInviteCodes({
        userPublicKey: values.userPublicKey,
        isApproved: true,
      });
    }
  };

  return (
    <Box css={{ padding: '$6' }}>
      <Formik<ApproveMigrationFormValues>
        initialValues={{
          userPublicKey: propOrEmptyString('publicKey')(user),
          approveMigration: false,
        }}
        onSubmit={handleSubmit}
        enableReinitialize={!user}
        validationSchema={Yup.object().shape({
          approveMigration: Yup.boolean().oneOf([true]),
        })}
      >
        <Form>
          <Grid css={{ gap: '$4' }}>
            <CheckboxAndWrapper
              name="approveMigration"
              label="Approve Creator Migration"
              description="Approve this user to migrate their account?"
            />

            <FormikSubmitButton
              label="Approve"
              submittingLabel="Approving…"
              submittedLabel="Approved"
            />
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
}

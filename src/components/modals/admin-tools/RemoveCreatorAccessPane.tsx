import { Formik, Form } from 'formik';
import { useQueryClient } from 'react-query';
import { propOr } from 'ramda';

import { propOrEmptyString } from 'utils/strings';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import CheckboxAndWrapper from 'components/forms/CheckboxAndWrapper';
import FormikSubmitButton from 'components/forms/FormikSubmitButton';

import { useUpdateCreatorStatus } from 'graphql/server/mutations/update-creator-status.generated';

import Account from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

interface RemoveCreatorAccessFormValues {
  isApprovedCreator: boolean;
  userPublicKey: string;
}

interface RemoveCreatorAccessPaneProps {
  user: Account;
}

export default function RemoveCreatorAccessPane(
  props: RemoveCreatorAccessPaneProps
): JSX.Element {
  const { user } = props;

  const queryClient = useQueryClient();

  const { mutateAsync: updateCreatorStatus } = useUpdateCreatorStatus();

  const handleSubmit = async (values: RemoveCreatorAccessFormValues) => {
    await updateCreatorStatus({
      userPublicKey: values.userPublicKey,
      creatorStatus: values.isApprovedCreator,
    });
    await queryClient.refetchQueries(QueryCacheKey.User);
  };

  return (
    <Box css={{ padding: '$6' }}>
      <Formik<RemoveCreatorAccessFormValues>
        initialValues={{
          isApprovedCreator: propOr(false, 'isApprovedCreator', user),
          userPublicKey: propOrEmptyString('publicKey')(user),
        }}
        onSubmit={handleSubmit}
        enableReinitialize={!user}
      >
        <Form>
          <Grid css={{ gap: '$4' }}>
            <CheckboxAndWrapper
              name="isApprovedCreator"
              label="Creator access"
              description="Should this user have creator access?"
            />

            <FormikSubmitButton
              label="Update access"
              submittingLabel="Updating access…"
              submittedLabel="Access updated"
            />
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
}

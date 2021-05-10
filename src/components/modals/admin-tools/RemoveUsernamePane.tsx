import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

import { notEmptyOrNil } from 'utils/helpers';
import { propOrEmptyString } from 'utils/strings';

import Box from 'components/base/Box';
import Grid from 'components/base/Grid';
import TextField from 'components/forms/fields/TextField';
import FormikSubmitButton from 'components/forms/FormikSubmitButton';

import { useUpdateUsername } from 'graphql/server/mutations/update-username.generated';

import Account from 'types/Account';
import { QueryCacheKey } from 'types/Queries';

interface RemoveUsernameFormValues {
  username: string;
  userPublicKey: string;
}

interface RemoveUsernamePaneProps {
  user: Account;
}

export default function RemoveUsernamePane(
  props: RemoveUsernamePaneProps
): JSX.Element {
  const { user } = props;

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: updateUsername } = useUpdateUsername({
    onSuccess: async (res) => {
      await router.push(`/${res.updateUsername.publicKey}`);
      await queryClient.refetchQueries(QueryCacheKey.User);
    },
  });

  const handleSubmit = async (values: RemoveUsernameFormValues) => {
    const hasUsernameValue = notEmptyOrNil(values.username);
    await updateUsername({
      userPublicKey: values.userPublicKey,
      username: hasUsernameValue ? values.username : null,
    });
  };

  return (
    <Box css={{ padding: '$6' }}>
      <Formik<RemoveUsernameFormValues>
        initialValues={{
          username: propOrEmptyString('username')(user),
          userPublicKey: propOrEmptyString('publicKey')(user),
        }}
        onSubmit={handleSubmit}
        enableReinitialize={!user}
      >
        <Form>
          <Grid css={{ gap: '$4' }}>
            <TextField name="username" placeholder="Username" />
            <FormikSubmitButton
              label="Update username"
              submittingLabel="Updating username…"
              submittedLabel="Username updated"
            />
          </Grid>
        </Form>
      </Formik>
    </Box>
  );
}

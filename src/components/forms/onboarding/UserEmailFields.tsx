/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Text } from 'theme-ui';

import TextField from 'components/forms/fields/TextField';
import FormBlock from 'components/forms/FormBlock';

export default function UserEmailFields(): JSX.Element {
  return (
    <FormBlock
      title="Receive email notifications"
      hintText={
        <Text variant="body.body" sx={{ marginBottom: ['m', null, 0] }}>
          Add your email address to receive notifications about your activity on
          Foundation. This will not be shown on your profile.
        </Text>
      }
    >
      <Grid mb={10}>
        <TextField name="email" placeholder="Email" />
      </Grid>
    </FormBlock>
  );
}

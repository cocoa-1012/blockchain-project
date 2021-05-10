/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Box } from 'theme-ui';

import SymbolField from 'components/forms/fields/SymbolField';
import TextField from 'components/forms/fields/TextField';
import UsernameAvailable from 'components/forms/fields/UsernameAvailable';
import FormBlock from 'components/forms/FormBlock';

export default function UserInfoFields(): JSX.Element {
  return (
    <FormBlock title="Enter your details.">
      <Grid gap={10} mb={10}>
        <TextField name="name" placeholder="Name" />
        <Box>
          <SymbolField
            name="username"
            placeholder="Username"
            hideError={true}
          />
          <UsernameAvailable name="username" />
        </Box>
      </Grid>
    </FormBlock>
  );
}

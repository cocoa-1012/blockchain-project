/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

import FormBlock from 'components/forms/FormBlock';
import CharacterCounter from '../CharacterCounter';
import TextAreaField from 'components/forms/fields/TextAreaField';

export default function UserBioFields(): JSX.Element {
  return (
    <FormBlock title="Add a short bio.">
      <Box>
        <Box mb={10}>
          <TextAreaField name="bio" placeholder="Enter a short bio" rows={10} />
          <CharacterCounter name="bio" maxLength={200} />
        </Box>
      </Box>
    </FormBlock>
  );
}

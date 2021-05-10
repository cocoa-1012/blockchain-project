/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';

import { FileUploadField } from '../FileUpload';
import FormBlock from 'components/forms/FormBlock';

interface UserBioFieldsProps {
  token: string;
}

export default function UserBioFields(props: UserBioFieldsProps): JSX.Element {
  const { token } = props;
  return (
    <FormBlock
      title="Upload a profile image."
      hintText={
        <Text variant="body.body" mb="s">
          Recommended size:
          <br /> 1000x1000px.
          <br />
          JPG, PNG or GIF.
          <br /> 10MB max size.
        </Text>
      }
    >
      <Box>
        <Box mb={10}>
          <FileUploadField<{ profileImageUrl: string }>
            name="profileImageUrl"
            token={token}
            // 10mb in bytes
            maxSize={10000000}
          />
        </Box>
      </Box>
    </FormBlock>
  );
}

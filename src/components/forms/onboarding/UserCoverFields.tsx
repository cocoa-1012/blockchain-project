/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';

import { FileUploadField } from '../FileUpload';
import FormBlock from 'components/forms/FormBlock';
interface CreatorCoverFieldsProps {
  token: string;
}

export default function CreatorCoverFields(
  props: CreatorCoverFieldsProps
): JSX.Element {
  const { token } = props;
  return (
    <FormBlock
      title="Upload a cover image"
      hintText={
        <Text variant="body.body" mb="s">
          Recommended size:
          <br /> 1500x500px.
          <br />
          JPG, PNG or GIF.
          <br /> 10MB max size.
        </Text>
      }
    >
      <Box>
        <Box mb={10}>
          <FileUploadField<{ coverImageUrl: string }>
            name="coverImageUrl"
            // 10mb in bytes
            maxSize={10000000}
            token={token}
          />
        </Box>
      </Box>
    </FormBlock>
  );
}

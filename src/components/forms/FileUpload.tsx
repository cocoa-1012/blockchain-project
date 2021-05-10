/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, Text } from 'theme-ui';
import PropTypes from 'prop-types';
import { useFileUpload, FileUploadProps } from 'hooks/use-file-upload';

import { notEmptyOrNil } from 'utils/helpers';
import { getFileName } from 'utils/urls';

import ErrorField from './fields/ErrorField';
import { FileName, PreviewBox, UploadPreviewImage } from './UploadPreview';

interface FileUploadFieldProps {
  maxSize: number;
  name: string;
  token: string;
}

export function FileUploadField<T>(props: FileUploadFieldProps): JSX.Element {
  const { maxSize = 2000000, name, token } = props;

  const fileUploadProps: FileUploadProps = {
    accept: 'image/jpeg, image/jpg, image/png, image/gif, image/svg+xml',
    maxSize,
    name,
    token,
  };

  const uploadProps = useFileUpload<T>(fileUploadProps);

  const {
    getRootProps,
    getInputProps,
    preview,
    field,
    meta,
    isDragActive,
  } = uploadProps;

  const hasPreview = notEmptyOrNil(preview);
  const hasValue = notEmptyOrNil(field.value);

  if (hasPreview || hasValue) {
    return <PreviewImage {...uploadProps} />;
  }

  return (
    <Box>
      <Flex
        {...getRootProps()}
        sx={{
          border: 'dashed 1px',
          borderColor: 'black.10',
          borderRadius: 10,
          minHeight: 115,
          alignItems: 'center',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <input {...getInputProps()} />
        <Text
          variant="stnd.body"
          sx={{
            maxWidth: 180,
            mx: 'auto',
            lineHeight: 1.4,
            textAlign: 'center',
          }}
        >
          {isDragActive
            ? `Drop image to upload.`
            : `Drag and drop an image here, or click to browse.`}
        </Text>
      </Flex>
      <ErrorField meta={meta} forceError />
    </Box>
  );
}

PreviewImageSingle.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  meta: PropTypes.object,
  isLoading: PropTypes.bool,
  helpers: PropTypes.object,
  previews: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

function PreviewImageSingle(props) {
  const { image, meta, isLoading, helpers } = props;

  const finalImage = image?.preview ?? image;

  return (
    <Box>
      <PreviewBox>
        <UploadPreviewImage
          image={finalImage}
          isLoading={isLoading}
          sx={{ mr: 'l' }}
          size={120}
        />
        <FileName isLoading={isLoading} onDelete={() => helpers.setValue('')}>
          {getFileName(image?.filename ?? finalImage)}
        </FileName>
      </PreviewBox>
      <ErrorField meta={meta} forceError />
    </Box>
  );
}

PreviewImage.propTypes = {
  previews: PropTypes.object,
  field: PropTypes.object,
  meta: PropTypes.object,
  isLoading: PropTypes.bool,
  helpers: PropTypes.object,
};

function PreviewImage(props) {
  const { preview, field, meta, isLoading, helpers } = props;

  return (
    <Box>
      <PreviewBox>
        <UploadPreviewImage
          image={preview?.preview ?? field.value}
          isLoading={isLoading}
          sx={{ mr: 'm' }}
        />
        <FileName isLoading={isLoading} onDelete={() => helpers.setValue('')}>
          {preview?.filename ??
            getFileName(preview?.filename ?? field.value ?? '')}
        </FileName>
      </PreviewBox>
      <ErrorField meta={meta} forceError />
    </Box>
  );
}

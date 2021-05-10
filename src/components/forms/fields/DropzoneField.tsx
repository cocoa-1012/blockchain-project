/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, Heading, Text, ThemeUIStyleObject } from 'theme-ui';
import { useDropzone } from 'react-dropzone';
import { useField } from 'formik';
import { is, includes } from 'ramda';
import { useCallback } from 'react';

import UploadIcon from 'assets/icons/upload-icon.svg';
import CloseIcon from 'assets/icons/circle-close-icon.svg';
import TxErrorIcon from 'assets/icons/tx-error.svg';

import { renderFilePreview } from 'components/FilePreview';

import {
  flexDirectionForPrefix,
  positionAbsolute,
  positionRelative,
} from 'types/styles';

import { mimeTypeExtensions } from 'utils/assets';
import { transitions } from 'utils/themes/main/theme';
import { notEmptyOrNil } from 'utils/helpers';
import { getFileExtension } from 'utils/urls';

import { UPLOAD_ERROR_MESSAGES } from 'schemas/upload';

interface ClearFormValueProps {
  onClick: () => void;
}

function ClearFormValue(props: ClearFormValueProps): JSX.Element {
  const { onClick } = props;
  return (
    <Box
      sx={{
        position: positionAbsolute,
        top: 20,
        right: 20,
        cursor: 'pointer',
        zIndex: 3,
      }}
      onClick={onClick}
    >
      <CloseIcon sx={{ display: 'block' }} />
    </Box>
  );
}

interface DropzoneFieldProps {
  name: string;
}

export default function DropzoneField(props: DropzoneFieldProps): JSX.Element {
  const { name } = props;

  const sx = getStyles();

  const [field, meta, helpers] = useField(name);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: ([file]) => {
      const extensionFallback = getFileExtension(file.name);
      const extension = mimeTypeExtensions[file.type] ?? extensionFallback;

      // create a new renamed file object with extension
      const renamedFile = new File([file], `nft.${extension}`, {
        type: file.type,
      });

      helpers.setTouched(true);
      helpers.setValue(renamedFile);
    },
  });

  const clearValue = useCallback(() => helpers.setValue(null), [helpers]);

  const hasValue = is(File, field.value);

  const errorMessage = meta.error ?? '';
  const isRequiredError = includes('is a required field', errorMessage);
  const hasError = notEmptyOrNil(errorMessage);

  if (hasError && !isRequiredError) {
    const errorDetails = UPLOAD_ERROR_MESSAGES[meta.error];
    return (
      <Flex sx={sx.errorWrapper}>
        <ClearFormValue onClick={clearValue} />
        <Flex {...getRootProps()} sx={sx.errorContainer}>
          <input {...getInputProps()} />

          {errorDetails && (
            <Box sx={{ maxWidth: 480, marginX: 'auto', textAlign: 'center' }}>
              <Flex sx={sx.errorIcon}>
                <TxErrorIcon width={64} height={56} sx={{ display: 'block' }} />
              </Flex>

              <Heading variant="h.m" sx={{ marginBottom: 'xs' }}>
                {errorDetails.title}
              </Heading>
              <Text variant="body.body">{errorDetails.message}</Text>
            </Box>
          )}
        </Flex>
      </Flex>
    );
  }

  if (hasValue) {
    return (
      <Flex sx={sx.previewContainer}>
        <ClearFormValue onClick={clearValue} />
        {renderFilePreview(field.value)}
      </Flex>
    );
  }

  return (
    <Flex {...getRootProps()} sx={{ ...sx.container, cursor: 'pointer' }}>
      <input {...getInputProps()} />
      <Box>
        <UploadIcon />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Heading variant="h.m" sx={{ marginBottom: 'm' }}>
          Upload
        </Heading>
        <Text variant="h.body" sx={sx.hint}>
          JPG, PNG, GLTF, GLB or MP4 videos accepted.
          <br />
          50MB limit.
        </Text>
      </Box>
      <Text variant="body.body" sx={sx.action}>
        {isDragActive
          ? `Drop your files here.`
          : `Drag and drop, or click to browse.`}
      </Text>
    </Flex>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    flexDirection: flexDirectionForPrefix,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white.100',
    boxShadow: 's',
    borderRadius: 10,
    position: positionRelative,
    zIndex: 2,
    paddingY: 'xl',
    transition: transitions.smooth.fast,
    '@media (hover: hover)': {
      '&:hover': {
        boxShadow: 'm',
      },
      '&:active': {
        boxShadow: 's',
        transform: 'translateY(0)',
      },
    },
  };
  const close: ThemeUIStyleObject = {
    position: positionAbsolute,
    top: 20,
    right: 20,
    cursor: 'pointer',
  };

  const hint: ThemeUIStyleObject = {
    maxWidth: 340,
    marginX: 'auto',
    fontWeight: 600,
    lineHeight: 1.4,
    color: 'black.40',
  };

  const action: ThemeUIStyleObject = {
    maxWidth: 130,
    textAlign: 'center',
    color: 'black.30',
    lineHeight: 1.7,
  };

  const previewContainer: ThemeUIStyleObject = {
    ...container,
    paddingY: 'l',
    paddingX: 'xxxl',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const errorIcon: ThemeUIStyleObject = {
    justifyContent: 'center',
    color: 'utility.red',
    marginBottom: 'm',
  };

  const errorWrapper: ThemeUIStyleObject = {
    flex: 'auto',
    flexDirection: 'column',
    position: 'relative',
  };

  const errorContainer: ThemeUIStyleObject = {
    ...container,
    padding: 'l',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'auto',
    cursor: 'pointer',
  };

  return {
    container,
    close,
    hint,
    action,
    previewContainer,
    errorIcon,
    errorContainer,
    errorWrapper,
  };
};

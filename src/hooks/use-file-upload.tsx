import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import * as Sentry from '@sentry/react';
import { isEmpty } from 'ramda';
import {
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
  useField,
} from 'formik';
import {
  DropzoneInputProps,
  DropzoneRootProps,
  useDropzone,
} from 'react-dropzone';

import { signFiles, uploadFile } from 'queries/uploads';

import { getFilePreview } from 'utils/images';
import { getError, getFileInfo } from 'utils/helpers';
import { bytesToSize } from 'utils/assets';

interface FilePreview {
  filename: string;
  mimetype: string;
  type: string;
}

interface FileUpload<T> {
  field: FieldInputProps<T>;
  helpers: FieldHelperProps<T>;
  meta: FieldMetaProps<T>;
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
  isDragActive: boolean;
  isLoading: boolean;
  preview: FilePreview;
}

export interface FileUploadProps {
  accept: string;
  maxSize: number;
  token: string;
  name: string;
}

export function useFileUpload<T>(props: FileUploadProps): FileUpload<T> {
  const { accept, maxSize, token, name } = props;

  const [field, meta, helpers] = useField<T>(name);
  const [loading, setLoading] = useState(false);

  const { mutateAsync: signFileMutation, isLoading } = useMutation(signFiles, {
    onError: (error) => {
      Sentry.captureException(getError(error));
    },
  });

  const [preview, setPreview] = useState<FilePreview>(null);

  const resetState = () => {
    setLoading(false);
    setPreview(null);
  };

  const touchField = useCallback(() => helpers.setTouched(true, false), [
    helpers,
  ]);

  const setValue = useCallback(
    (value) => {
      helpers.setValue(value);
      touchField();
    },
    [helpers, touchField]
  );

  const setError = (err) => {
    helpers.setError(err);
    touchField();
  };

  const appendImages = useCallback(([file]) => setValue(file), [setValue]);

  // immediately uploads array of files to s3 and returns the array of urls
  const onDrop = useCallback(
    async (files: File[]) => {
      // short circuit
      if (isEmpty(files)) {
        return;
      }

      helpers.setError(null);

      const [fileResponse]: FilePreview[] = await Promise.all(
        files.map(async (file: File) => {
          const preview = await getFilePreview(file);
          const fileInfo = getFileInfo(file);
          return { ...fileInfo, preview };
        })
      );

      setPreview(fileResponse);

      setLoading(true);

      const fileInput = files.map(getFileInfo);

      try {
        const signedFilesRequest = await signFileMutation({
          files: fileInput,
          token,
        });
        const fileUrls = await Promise.all(
          signedFilesRequest.signFiles.map(async (file, i) =>
            uploadFile(files[i], file.signedRequest, file.url)
          )
        );
        resetState();
        appendImages(fileUrls);
      } catch (error) {
        resetState();
        setError('There was an error uploading your file');
      }
    },
    [field, meta, helpers, preview]
  );

  const onDropRejected = useCallback(
    (files) => {
      // short circuit
      if (isEmpty(files)) {
        return;
      }

      files.forEach(({ file }) => {
        if (file.size > maxSize) {
          const err = `${file.name} is more than ${bytesToSize(
            maxSize
          )} in size`;
          return setError(err);
        }

        if (!accept.includes(file.type)) {
          return setError(`File type ${file.type} isn’t allowed unfortunately`);
        }

        return setError('There was an error with your file');
      });
    },
    [field, helpers, meta]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: onDrop,
    onDropRejected,
    accept,
    maxSize,
  });

  return {
    field,
    helpers,
    meta,
    getRootProps,
    getInputProps,
    isDragActive,
    isLoading: isLoading || loading,
    preview,
  };
}

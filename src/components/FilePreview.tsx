/** @jsxRuntime classic */
/* @jsx jsx */
import { jsx, Box } from 'theme-ui';
import { cond, curry, compose, includes, prop } from 'ramda';
import { memo } from 'react';
import { css } from 'stitches.config';
import { getFileExtension } from 'utils/urls';

import Model from 'components/model-media/Model';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';

const fileIncludesMimeType = curry((mimeTypes: string[], file: File): boolean =>
  compose<File, string, boolean>(
    (fileType: string) => includes(fileType, mimeTypes),
    prop('type')
  )(file)
);

const fileIncludesExtension = curry(
  (mimeTypes: string[], file: File): boolean =>
    compose<File, string, string, boolean>(
      (fileExtension: string) => includes(fileExtension, mimeTypes),
      (fileName: string) => getFileExtension(fileName),
      prop('name')
    )(file)
);

const modelStyles = css({ width: '100%', height: '100%' })();

interface FilePreviewProps {
  file: File;
}

export function ImagePreview(props: FilePreviewProps): JSX.Element {
  const { file } = props;
  return (
    <img
      src={URL.createObjectURL(file)}
      alt={file.name}
      sx={{ maxHeight: '440px', display: 'block' }}
    />
  );
}

export function VideoPreview(props: FilePreviewProps): JSX.Element {
  const { file } = props;

  return (
    <video
      loop
      src={URL.createObjectURL(file)}
      sx={{ maxHeight: '440px', display: 'block' }}
      autoPlay
      muted
      playsInline
    />
  );
}

export function ModelPreview(props: FilePreviewProps): JSX.Element {
  const { file } = props;
  const { setFieldValue } = useFormikContext();

  const handlePosterBlob = useCallback(
    (value: Blob) => {
      setFieldValue('modelPoster', value);
    },
    [setFieldValue]
  );

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Model
        src={URL.createObjectURL(file)}
        toBlob={handlePosterBlob}
        className={modelStyles}
      />
    </Box>
  );
}

const VideoPreviewMemo = memo<FilePreviewProps>(VideoPreview);
const ModelPreviewMemo = memo<FilePreviewProps>(ModelPreview);

export const renderFilePreview = cond([
  [
    (file: File) =>
      fileIncludesMimeType(['image/jpg', 'image/jpeg', 'image/png'], file),
    (file: File) => <ImagePreview file={file} />,
  ],
  [
    (file: File) => fileIncludesMimeType(['video/mp4'], file),
    (file: File) => <VideoPreviewMemo file={file} />,
  ],
  [
    (file: File) => fileIncludesExtension(['gltf', 'glb'], file),
    (file: File) => <ModelPreviewMemo file={file} />,
  ],
]);

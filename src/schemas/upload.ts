import * as Yup from 'yup';

import { isEmptyOrNil } from 'utils/helpers';
import { createModelMimeType, isModel } from 'utils/assets';

const ERROR_MESSAGE_STRINGS = {
  UPLOAD_TOO_LARGE: 'This file is too large.',
  UPLOAD_NOT_SUPPORTED: 'This file type is not supported.',
  CODEC_NOT_SUPPORTED: 'This video codec is not supported.',
};

export const UPLOAD_ERROR_MESSAGES = {
  [ERROR_MESSAGE_STRINGS.UPLOAD_TOO_LARGE]: {
    title: 'This file is too large.',
    message: 'Upload a file that is 50MB or smaller.',
  },
  [ERROR_MESSAGE_STRINGS.UPLOAD_NOT_SUPPORTED]: {
    title: 'This file type is not supported.',
    message: 'Upload a JPG, PNG, GLTF, GLB or MP4.',
  },
};

const SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'video/mp4',
  'text/plain',
  'model/gltf-binary',
  'model/gltf+json',
];

// 50mb in bytes
const FILE_SIZE = 52428800;

export const UploadSchema = Yup.object().shape({
  file: Yup.mixed()
    .required()
    .test('fileSize', ERROR_MESSAGE_STRINGS.UPLOAD_TOO_LARGE, (value: File) => {
      const emptyValue = isEmptyOrNil(value);
      if (emptyValue) {
        return true;
      }
      return value.size <= FILE_SIZE;
    })
    .test(
      'fileType',
      ERROR_MESSAGE_STRINGS.UPLOAD_NOT_SUPPORTED,
      (value: File) => {
        const emptyValue = isEmptyOrNil(value);
        if (emptyValue) {
          return true;
        }
        const fallbackFormat = createModelMimeType(value.name);
        const isTypeEmpty = isEmptyOrNil(value.type);
        return SUPPORTED_FORMATS.includes(
          isTypeEmpty ? fallbackFormat : value.type
        );
      }
    ),
  modelPoster: Yup.mixed().when('file', {
    is: (file) => {
      return isModel(file?.name);
    },
    then: Yup.mixed().required(),
  }),
});

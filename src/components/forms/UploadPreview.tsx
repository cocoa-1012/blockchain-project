/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, Text, AspectRatio } from 'theme-ui';
import { memo, ReactNode } from 'react';
import isImage from 'is-image';

import SuccessIcon from 'assets/icons/success-icon.svg';
import DeleteIcon from 'assets/icons/delete-icon.svg';
import SpinnerStroked from 'components/SpinnerStroked';

import { transitions } from 'utils/themes/main/theme';
import { notEmpty } from 'utils/helpers';
import { isVideo } from 'utils/assets';

interface EditablePreviewImageProps {
  image: string;
  className: string;
  isLoading: boolean;
  onDelete: () => void;
}

export function EditablePreviewImage(
  props: EditablePreviewImageProps
): JSX.Element {
  const { image, className, isLoading, onDelete } = props;

  return (
    <AspectRatio
      ratio={1}
      sx={{
        cursor: 'move',
        display: 'flex',
        '&:hover .delete-icon': {
          opacity: 1,
        },
        '&:active': {
          cursor: 'move',
        },
      }}
    >
      <Box
        className={className}
        sx={{
          position: 'relative',
          display: 'flex',
          flex: 'auto',
        }}
      >
        {onDelete && (
          <Box
            onClick={onDelete}
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,

              transition: transitions.smooth.fast,
              opacity: 0,
              cursor: 'pointer',
              zIndex: 2,
            }}
            className="delete-icon"
          >
            <DeleteIcon />
          </Box>
        )}

        <RenderImage image={image} isLoading={isLoading} />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {isLoading && (
            <Box sx={{ minWidth: 66, minHeight: 66 }}>
              <SpinnerStroked size={66} />
            </Box>
          )}
        </Box>
      </Box>
    </AspectRatio>
  );
}

interface UploadPreviewImageProps {
  image: string;
  className?: string;
  size?: number;
  isLoading: boolean;
}

export function UploadPreviewImage(
  props: UploadPreviewImageProps
): JSX.Element {
  const { image, className, size = 72, isLoading } = props;

  return (
    <Flex
      className={className}
      sx={{
        position: 'relative',
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
      }}
    >
      <RenderImage image={image} isLoading={isLoading} />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {isLoading ? (
          <Box sx={{ minWidth: 28, minHeight: 28 }}>
            <SpinnerStroked size={28} />
          </Box>
        ) : (
          <SuccessIcon style={{ display: 'block' }} width={32} height={32} />
        )}
      </Box>
    </Flex>
  );
}

interface PreviewBoxProps {
  children: ReactNode;
}

export function PreviewBox(props: PreviewBoxProps): JSX.Element {
  const { children } = props;
  return (
    <Flex
      sx={{
        boxShadow: 'm',
        borderRadius: 10,
        alignItems: 'center',
        bg: 'white.100',
        p: 20,
        minHeight: 115,
      }}
    >
      {children}
    </Flex>
  );
}

interface FileNameProps {
  children: ReactNode;
  isLoading: boolean;
  onDelete: () => void;
}

export function FileName(props: FileNameProps): JSX.Element {
  const { children, isLoading, onDelete } = props;
  return (
    <Box>
      <Text
        variant="h.body"
        mb="xs"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </Text>
      {isLoading ? (
        <Text variant="stnd.body">Uploading…</Text>
      ) : (
        <Text
          variant="stnd.body"
          sx={{ color: 'black.50', cursor: 'pointer' }}
          onClick={onDelete}
        >
          Delete
        </Text>
      )}
    </Box>
  );
}

interface RenderImageProps {
  isLoading: boolean;
  image: string;
}

const RenderImage = memo((props: RenderImageProps) => {
  const { isLoading, image } = props;

  if (isVideo(image)) {
    return (
      <video
        src={image}
        autoPlay
        muted
        playsInline
        loop
        sx={{
          borderRadius: 8,
          objectFit: 'cover',
          position: 'relative',
          zIndex: 1,
        }}
      />
    );
  }

  if (isImage(image) || notEmpty(image)) {
    return (
      <Box
        style={{ backgroundImage: `url(${image})` }}
        sx={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isLoading ? 0.4 : 1,
          borderRadius: 8,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
    );
  }

  return (
    <Box
      sx={{ bg: 'black.5', borderRadius: 8, width: '100%', height: '100%' }}
    />
  );
});

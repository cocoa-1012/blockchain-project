/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Button, Text, ThemeUIStyleObject } from 'theme-ui';
import { useFormikContext } from 'formik';

import UploadIcon from 'assets/icons/upload-icon.svg';

import { pointerEventsNone, positionRelative } from 'types/styles';

export default function UploadArtworkSubmitButton(): JSX.Element {
  const { isValid } = useFormikContext();

  const sx = getStyles();

  const buttonStyles: ThemeUIStyleObject = {
    ...sx.button,
    backgroundColor: isValid ? 'black.100' : 'black.10',
    borderColor: isValid ? 'black.100' : 'black.10',
    pointerEvents: isValid ? 'all' : pointerEventsNone,
  };

  return (
    <Button type="submit" sx={buttonStyles}>
      <Box sx={{ color: 'white.100' }}>
        <UploadIcon sx={{ display: 'block' }} width={24} height={24} />
      </Box>

      <Text variant="h.s" sx={sx.text}>
        Upload
      </Text>
    </Button>
  );
}

const getStyles = () => {
  const button: ThemeUIStyleObject = {
    display: 'flex',
    borderRadius: 999,
    paddingY: ['m', 'm', 'm'],
    paddingX: ['xl', 'xl', 'xl'],
    minWidth: 235,
    justifyContent: 'center',
  };

  const text: ThemeUIStyleObject = {
    position: positionRelative,
    top: -3,
    marginLeft: 20,
  };

  return { button, text };
};

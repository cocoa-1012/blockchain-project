/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

import { buildImgixUrlNew } from 'utils/assets';
import { getLastValue } from 'utils/helpers';
import { getAvatarByIndex } from 'utils/users';

import { CircleAvatarProps, AvatarSize } from './types';

export default function CircleAvatar(props: CircleAvatarProps): JSX.Element {
  const { size = 32, userIndex = 0, imageUrl, className } = props;

  const avatarBackground = getAvatarByIndex(userIndex);

  const avatarSize = getLastValue(size);

  return (
    <Box
      style={getBackgroundStyle({ imageUrl, size: avatarSize })}
      sx={{
        ...fixedSize(size),
        background: avatarBackground,
        backgroundColor: 'black.5',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 999,
      }}
      className={className}
    />
  );
}

const getBackgroundStyle = ({ imageUrl, size }) => {
  if (imageUrl) {
    const buildAvatarUrl = buildImgixUrlNew({
      q: 45,
      w: size,
      h: size,
      fit: 'crop',
      auto: 'format,compress',
      dpr: 2,
    });
    return {
      backgroundImage: `url(${buildAvatarUrl(imageUrl)})`,
    };
  }
  return null;
};

const fixedSize = (size: AvatarSize) => ({
  minWidth: size,
  minHeight: size,
  maxWidth: size,
  maxHeight: size,
});

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex } from 'theme-ui';
import { ReactNode } from 'react';

import Body from 'components/Body';
import CircleAvatar from 'components/avatars/CircleAvatar';

import Account from 'types/Account';
import { positionRelative, positionAbsolute } from 'types/styles';

interface ProfileCoverImageProps {
  coverImage: string;
  avatar: string;
  avatarBackground: string;
  creator: Account;
  meta: ReactNode;
}

export default function ProfileCoverImage(
  props: ProfileCoverImageProps
): JSX.Element {
  const { coverImage, avatar, creator, meta } = props;

  const sx = getStyles({ coverImage });

  return (
    <Box sx={sx.container}>
      <Box sx={{ position: 'relative' }}>
        {coverImage && <GradientOverlay />}
        <Box sx={sx.coverImage} />
      </Box>
      <Body sx={{ height: 0 }}>
        <Flex sx={sx.pin}>
          <CircleAvatar
            size={[120, null, 180]}
            imageUrl={avatar}
            userIndex={creator?.userIndex}
            sx={sx.avatar}
          />
        </Flex>

        {meta}
      </Body>
    </Box>
  );
}

function GradientOverlay() {
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage:
          'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)',
      }}
    />
  );
}

const getStyles = ({ coverImage }) => ({
  coverImage: {
    height: [180, null, 280],
    backgroundImage: coverImage ? `url(${coverImage})` : null,
    backgroundColor: 'black.5',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  container: {
    position: positionRelative,
    marginBottom: [72, null, 105],
  },
  banner: {
    position: positionRelative,
    marginBottom: ['l', 'xl'],
    paddingBottom: [60, null, 90],
  },
  pin: {
    position: positionAbsolute,
    bottom: 0,
    left: ['50%', null, 'auto'],
    zIndex: 3,
    transform: ['translate(-50%, 50%)', null, 'translateY(56px)'],
  },
  avatar: {
    border: 'solid 10px',
    borderColor: 'white.100',
  },
  avatarImage: {
    borderRadius: 999,
    display: 'block',
    marginLeft: -2,
    marginTop: -2,
    minHeight: 'calc(100% + 4px)',
    minWidth: 'calc(100% + 4px)',
  },
});

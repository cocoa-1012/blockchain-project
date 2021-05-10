/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';
import Link from 'next/link';

import { transitions } from 'utils/themes/main/theme';
import WorldCardMedia from 'components/cards/worlds/WorldCardMedia';
import CircleAvatar from 'components/avatars/CircleAvatar';
import Account from 'types/Account';

interface WorldCardProps {
  title: string;
  href: string;
  assetUrl: string;
  posterUrl?: string;
  curatedBy?: Account;
}

export default function WorldCard(props: WorldCardProps): JSX.Element {
  const { href, assetUrl, posterUrl, title, curatedBy } = props;

  return (
    <Link href={href} passHref>
      <Box
        as="a"
        sx={{
          borderRadius: 10,
          boxShadow: 's',
          height: [240, null, 490],
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          transition: transitions.smooth.fast,
          textDecoration: 'none',
          // This is here due to a Safari rendering bug that makes video not overflow:hidden
          transform: 'translate3d(0, 0, 0)',
          cursor: 'pointer',
          '@media (hover: hover)': {
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 'm',
              video: { transform: 'scale(1.1)' },
              img: { transform: 'scale(1.1)' },
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: 's',
            },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
          }}
        >
          <WorldCardMedia assetUrl={assetUrl} posterUrl={posterUrl} />
        </Box>
        <Box
          sx={{
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            width: '100%',
            px: ['s', null, 'm'],
            py: ['s', null, 'm'],
            backgroundImage:
              'linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.58) 100%)',
          }}
        >
          <Text
            variant="stnd.s"
            sx={{
              fontWeight: 600,
              color: 'white.100',
              width: '100%',
            }}
          >
            {title}
          </Text>
          {curatedBy && (
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 's' }}>
              <CircleAvatar
                size={37}
                userIndex={curatedBy?.userIndex}
                imageUrl={curatedBy?.profileImageUrl}
                sx={{
                  display: ['none', null, 'block'],
                  border: '5px solid',
                  borderColor: 'white.100',
                  marginRight: 'xs',
                }}
              />
              <Text
                variant="stnd.body"
                sx={{
                  color: 'white.100',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                by @{curatedBy?.username}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Link>
  );
}

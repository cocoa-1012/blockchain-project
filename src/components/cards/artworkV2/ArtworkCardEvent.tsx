/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Text } from 'theme-ui';
import Link from 'next/link';

import { always, cond, propEq } from 'ramda';

import FollowPopover from 'components/follows/FollowPopover';

import { ArtworkEvent, EventType } from 'types/Event';

import { transitions } from 'utils/themes/main/theme';
import { publicKeyOrIdOrAddress } from 'utils/helpers';
import UserTagRaw from 'components/users/UserTagRaw';
import { buildUserProfilePath } from 'utils/artwork/artwork';
import { positionAbsolute, positionRelative } from 'types/styles';
import { formatRelativeTimestamp } from 'utils/dates/dates';

const getEventText = cond([
  [propEq('eventType', EventType.Minted), always('minted')],
  [propEq('eventType', EventType.Listed), always('listed')],
  [propEq('eventType', EventType.PriceChanged), always('changed the price')],
  [propEq('eventType', EventType.Bid), always('placed a bid')],
]);

interface ArtworkCardEvent {
  event: ArtworkEvent;
  artworkPath: string;
  isHovered?: boolean;
}

export default function ArtworkCardEvent(props: ArtworkCardEvent): JSX.Element {
  const { event, artworkPath, isHovered } = props;

  const eventUser = event?.user;

  const eventText = getEventText(event);

  const profilePath = buildUserProfilePath({ user: eventUser });

  return (
    <Box
      sx={{
        position: positionRelative,
        transition: transitions.smooth.fast,
        willChange: 'transform',
        transform: isHovered ? 'translateY(-4px)' : 'none',
      }}
    >
      <Link href={artworkPath}>
        <a
          sx={{
            position: positionAbsolute,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            color: 'transparent',
            userSelect: 'none',
          }}
        >
          {eventText}
        </a>
      </Link>
      <Box
        sx={{
          display: 'flex',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backgroundColor: 'white.100',
          paddingTop: 's',
          paddingBottom: 's',
          paddingLeft: 's',
          paddingRight: 'm',
          marginX: 'xs',
          cursor: 'pointer',
          color: 'currentColor',
          textDecoration: 'none',
          transition: transitions.smooth.fast,
          boxShadow: isHovered ? 'm' : 's',
        }}
      >
        <Flex sx={{ paddingRight: 'm', alignItems: 'center' }}>
          <Text
            variant="stnd.body"
            sx={{
              fontWeight: 600,
              fontSize: ['sub', 'body'],
            }}
          >
            <Box
              sx={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: 'xxs',
              }}
            >
              <FollowPopover
                publicKey={publicKeyOrIdOrAddress(event)}
                sx={{ zIndex: 3, position: 'relative' }}
              >
                <Link href={profilePath}>
                  <a
                    sx={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'black.60',
                      transition: transitions.smooth.fast,
                      '@media (hover: hover)': {
                        '&:hover': {
                          color: 'black.100',
                        },
                      },
                    }}
                  >
                    <UserTagRaw
                      user={eventUser}
                      color="currentColor"
                      sx={{
                        backgroundColor: 'transparent',
                        mt: -1,
                      }}
                    />
                  </a>
                </Link>
              </FollowPopover>
            </Box>
            {eventText}
          </Text>
        </Flex>
        <Box sx={{ marginLeft: 'auto', flexShrink: 0, paddingTop: 'xxs' }}>
          <Text variant="stnd.body" sx={{ fontWeight: 600, color: 'black.40' }}>
            {formatRelativeTimestamp(event.blockTimestamp)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

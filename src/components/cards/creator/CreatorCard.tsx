/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, AspectRatio, Image, Box, Text, Grid } from 'theme-ui';
import { ReactNode } from 'react';

import { getUsernameOrAddress, truncateString } from 'utils/helpers';
import { getCreatorCardHero } from 'utils/assets';

import Account from 'types/Account';
import { transitions } from 'utils/themes/main/theme';
import { StyleObject } from 'types/styles';

import Link from 'components/links/Link';
import CircleAvatar from 'components/avatars/CircleAvatar';
import CardContextProvider, { useCardContext } from '../CardContext';
import CreatorCardHeading from './CreatorCardHeading';
import CreatorCardSubheading from './CreatorCardSubheading';

interface CreatorCardProps {
  creator: Account;
  meta?: ReactNode;
  hideBiosOnMobile?: boolean;
}

export default function CreatorCardWithContext(
  props: CreatorCardProps
): JSX.Element {
  return (
    <CardContextProvider>
      <CreatorCard {...props} />
    </CardContextProvider>
  );
}

export function CreatorCard(props: CreatorCardProps): JSX.Element {
  const { creator, meta, hideBiosOnMobile } = props;

  const coverImageUrl = getCreatorCardHero(creator);
  const avatarUrl = creator?.profileImageUrl;

  const usernameOrAddress = getUsernameOrAddress(creator);

  const { isHovered } = useCardContext();

  const sx = getStyles({ isHovered });

  return (
    <Flex sx={{ ...sx.card, flexDirection: 'column', flex: 1 }}>
      <Link href={`/${usernameOrAddress}`}>
        <a
          sx={{
            ...sx.link,
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <AspectRatio ratio={1.75} sx={sx.ratio}>
              {coverImageUrl && (
                <Image
                  loading="lazy"
                  src={coverImageUrl}
                  sx={{
                    display: 'block',
                    objectFit: 'cover',
                    minHeight: '100%',
                    minWidth: '100%',
                  }}
                />
              )}
            </AspectRatio>
            <Box sx={{ marginX: 'm', position: 'relative' }}>
              <Box sx={sx.avatar}>
                <CircleAvatar
                  size={80}
                  imageUrl={avatarUrl}
                  userIndex={creator?.userIndex}
                />
              </Box>
            </Box>
          </Box>
          <Box sx={sx.meta}>
            <Grid gap={5} sx={{ marginBottom: 's' }}>
              <CreatorCardHeading user={creator} />
              <CreatorCardSubheading user={creator} />
            </Grid>
            <Text
              variant="body.body"
              sx={{
                fontSize: 15,
                display: hideBiosOnMobile
                  ? ['none', 'block', 'block']
                  : 'block',
              }}
            >
              {truncateString(120, creator?.bio)}
            </Text>
          </Box>
        </a>
      </Link>
      {meta}
    </Flex>
  );
}

interface GetStylesArgs {
  isHovered: boolean;
}

const getStyles = ({ isHovered }: GetStylesArgs): StyleObject => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 's',
    borderRadius: 10,
    overflow: 'hidden',
    transition: transitions.smooth.fast,
    backgroundColor: 'white.100',
    textDecoration: 'none',
    willChange: 'transform',
    color: 'black.100',
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 'm',
      },
      '&:active': {
        transform: isHovered ? null : 'translateY(0)',
        boxShadow: isHovered ? null : 's',
      },
    },
  },

  ratio: {
    backgroundColor: 'black.5',
    display: 'flex',
  },
  avatar: {
    padding: 8,
    backgroundColor: 'white.100',
    width: 96,
    height: 96,
    position: 'absolute',
    left: 0,
    transform: 'translateY(-50%)',
    display: 'flex',
    borderRadius: 999,
  },
  meta: { paddingX: 'm', paddingTop: 'xxl', paddingBottom: 'xl' },
});

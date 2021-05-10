/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Heading, Text } from 'theme-ui';

import CircleAvatar from 'components/avatars/CircleAvatar';
import Link from 'components/links/Link';
import Hoverable from 'components/Hoverable';

import Account from 'types/Account';

import { maybeLowerCase } from 'utils/case';
import { getUsernameOrAddress } from 'utils/helpers';
import { inlineLinkStyles } from 'utils/styles';

interface ArtworkCreatorBioProps {
  creator: Account;
}

export default function ArtworkCreatorBio(
  props: ArtworkCreatorBioProps
): JSX.Element {
  const { creator } = props;

  return (
    <Box sx={{ paddingTop: ['xl', 'xxxl', 'xxxxl'], marginBottom: 'l' }}>
      <Heading
        variant="h.s"
        sx={{
          paddingBottom: 'm',
          borderBottom: 'solid 1px',
          borderColor: 'black.100',
          marginBottom: ['l', 'xl'],
        }}
      >
        Creator
      </Heading>

      <Grid
        gap={['l', null, 'xl']}
        columns={[1, null, null, 2]}
        sx={{ alignItems: 'flex-start' }}
      >
        <Grid
          sx={{
            alignItems: 'center',
            gridTemplateColumns: ['80px auto', '120px auto'],
            gap: ['s', 'l'],
          }}
        >
          <Link href={`/${getUsernameOrAddress(creator)}`}>
            <a>
              <Hoverable
                sx={{ borderRadius: 999, boxShadow: 'm' }}
                hoverStyles={{ boxShadow: 'l' }}
              >
                <CircleAvatar
                  size={[80, 120]}
                  imageUrl={creator?.profileImageUrl}
                  userIndex={creator?.userIndex}
                />
              </Hoverable>
            </a>
          </Link>

          <ArtworkCreatorInfo creator={creator} />
        </Grid>
        <Text
          sx={{
            lineHeight: 1.3,
            fontFamily: 'body',
            fontWeight: 500,
            fontSize: ['xs', 's'],
          }}
        >
          {creator.bio}
        </Text>
      </Grid>
    </Box>
  );
}

interface ArtworkCreatorInfoProps {
  creator: Account;
}

function ArtworkCreatorInfo(props: ArtworkCreatorInfoProps) {
  const { creator } = props;
  return (
    <Box>
      <Link href={`/${getUsernameOrAddress(creator)}`}>
        <a
          sx={{
            display: 'block',
            marginBottom: [5, 'xs'],
            fontSize: ['s', 'm', 'l'],
            fontFamily: 'body',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            textDecoration: 'none',
            ...inlineLinkStyles,
            color: 'black.100',
          }}
        >
          {creator.name}
        </a>
      </Link>

      <Text sx={{ display: 'flex' }} variant="h.s">
        <Link href={`/${getUsernameOrAddress(creator)}`}>
          <a sx={{ textDecoration: 'none', display: 'block' }}>
            <Text variant="gradient">@{maybeLowerCase(creator.username)}</Text>
          </a>
        </Link>
      </Text>
    </Box>
  );
}

/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Button, Heading, Text } from 'theme-ui';

import TextField from 'components/forms/fields/TextField';
import InstagramOverwriteLink from 'components/links/InstagramOverwriteLink';
import { transitions } from 'utils/themes/main/theme';
import Image from 'next/image';

import useAuthToken from 'hooks/queries/use-auth-token';
import Body from 'components/Body';
const BUTTON_AND_WARNING_WIDTH = 400;

export default function InstagramDuplicate({ handleClick }): JSX.Element {
  const sx = getStyles();

  const { user } = useAuthToken();

  return (
    <Body
      sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid gap="l">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 540,
          }}
        >
          <Image
            src="/images/Instagram.png"
            alt="Instagram"
            width="80"
            height="80"
          />
          <Heading
            variant="h.m"
            sx={{
              marginTop: 'l',
              marginBottom: 'l',
              textAlign: 'center',
            }}
          >
            This Instagram profile is already being used to verify another
            Foundation profile.
          </Heading>
          <Text
            variant="body.body"
            sx={{ marginBottom: 'l', textAlign: 'center', maxWidth: 380 }}
          >
            If you continue, the Instagram verification will be removed from the
            original profile and applied to your current profile.
          </Text>
          <InstagramOverwriteLink
            width={BUTTON_AND_WARNING_WIDTH}
            handleClick={handleClick}
          />
        </Box>
      </Grid>
    </Body>
  );
}

const getStyles = () => ({
  form: {
    paddingY: 'xxl',
    boxShadow: 's',
    borderRadius: 10,
    backgroundColor: 'white.100',
  },
  grayBox: {
    paddingY: 'm',
    paddingX: 'm',
    marginBottom: 's',
    width: BUTTON_AND_WARNING_WIDTH,
    borderRadius: 10,
    backgroundColor: 'black.10',
  },
});

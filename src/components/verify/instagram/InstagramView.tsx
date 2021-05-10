/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Button, Heading, Text } from 'theme-ui';

import TextField from 'components/forms/fields/TextField';
import InstagramConnectLink from 'components/links/InstagramConnectLink';
import { transitions } from 'utils/themes/main/theme';
import Image from 'next/image';

import useAuthToken from 'hooks/queries/use-auth-token';
import Body from 'components/Body';
const BUTTON_AND_WARNING_WIDTH = 400;

export default function InstagramView(): JSX.Element {
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
            maxWidth: 460,
          }}
        >
          <Image
            src="/images/Instagram.png"
            alt="Instagram"
            width="80"
            height="80"
          />
          <Heading
            variant="h.xl"
            sx={{ marginTop: 'l', marginBottom: 'l', textAlign: 'center' }}
          >
            Verify your profile via Instagram
          </Heading>
          <Text
            variant="body.body"
            sx={{ marginBottom: 'l', textAlign: 'center', maxWidth: 380 }}
          >
            Verify your profile to prove to the authenticity of your profile by
            connecting your Instagram account to Foundation.
          </Text>
          <Box sx={sx.grayBox}>
            <Text
              variant="body.body"
              sx={{ textAlign: 'center', fontSize: 14 }}
            >
              Please visit{' '}
              <a
                href={`https://www.instagram.com`}
                sx={{
                  textDecoration: 'none',
                  color: 'black.60',
                  fontWeight: 'bolder',
                  transition: transitions.smooth.fast,
                  cursor: 'pointer',
                  '@media (hover: hover)': {
                    '&:hover': {
                      color: 'black.100',
                    },
                  },
                }}
              >
                Instagram
              </a>{' '}
              to ensure you are currently signed in to the account you want to
              verify.
            </Text>
          </Box>
          <InstagramConnectLink width={BUTTON_AND_WARNING_WIDTH} />
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

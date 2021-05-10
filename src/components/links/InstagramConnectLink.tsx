/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
/* eslint-disable react/jsx-max-depth */
import { jsx, Flex, Text, Button } from 'theme-ui';
import InstagramIcon from 'assets/icons/instagram-icon.svg';
import { useRouter } from 'next/router';
import { getFirstValue } from 'utils/helpers';

const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;

interface InstagramConnectLinkProps {
  text?: string;
  // redirectPath: string;
  width?: number;
}

export default function InstagramConnectLink(
  props: InstagramConnectLinkProps
): JSX.Element {
  const router = useRouter();
  const {
    text = 'Connect to Instagram',
    // redirectPath
    width = '100%',
  } = props;

  const redirectPath = getFirstValue(router.query['redirect-path']);

  const windowLocationHref = window.location.href;

  const partsOfURL = windowLocationHref.split('?');
  const redirectURI = encodeURI(partsOfURL[0]);
  const redirectPathEncoded = encodeURI(redirectPath);

  // Note: InstagramShareButton within InstagramView
  // uses the redirect-path query param to pass through as
  // state following the Instagram API docs
  // https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions/

  return (
    <a
      href={`https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectURI}&scope=user_profile&response_type=code&state=${redirectPathEncoded}`}
      sx={{ display: 'block' }}
    >
      <Button
        type="button"
        sx={{ width: width, paddingRight: '36px !important' }}
      >
        <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <InstagramIcon width={24} height={24} sx={{ display: 'block' }} />
          <Text sx={{ marginLeft: 's', position: 'relative', top: -2 }}>
            {text}
          </Text>
        </Flex>
      </Button>
    </a>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
/* eslint-disable react/jsx-max-depth */
import { jsx, Flex, Text, Button } from 'theme-ui';
import TwitterIcon from 'assets/icons/twitter-icon.svg';

interface TwitterShareButtonLinkProps {
  twitterShareText: string;
  text?: string;
}

export default function TwitterShareButtonLink(
  props: TwitterShareButtonLinkProps
): JSX.Element {
  const { twitterShareText, text = 'Tweet it' } = props;
  return (
    <a
      href={`https://twitter.com/intent/tweet?text=${encodeURI(
        twitterShareText
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ display: 'block' }}
    >
      <Button
        type="button"
        sx={{ width: '100%', paddingRight: '36px !important' }}
      >
        <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <TwitterIcon width={24} height={24} sx={{ display: 'block' }} />
          <Text sx={{ marginLeft: 's', position: 'relative', top: -2 }}>
            {text}
          </Text>
        </Flex>
      </Button>
    </a>
  );
}

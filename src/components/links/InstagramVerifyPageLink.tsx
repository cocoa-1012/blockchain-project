/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Text, Button } from 'theme-ui';

import InstagramIcon from 'assets/icons/instagram-icon.svg';

import Link from './Link';
import { VariantOptions } from 'types/ButtonVariantOptions';
import { BUTTON_WIDTH } from 'utils/buttons';

interface InstagramVerifyPageLinkProps {
  text?: string;
  variant?: VariantOptions;
  redirectPath: string;
}

export default function InstagramVerifyPageLink(
  props: InstagramVerifyPageLinkProps
): JSX.Element {
  const { text, variant = VariantOptions.outline, redirectPath } = props;
  return (
    <Link
      href={{
        pathname: '/profile/verify/instagram',
        query: { 'redirect-path': redirectPath },
      }}
    >
      <a sx={{ display: 'block' }}>
        <Button
          variant={variant}
          type="button"
          sx={{
            width: BUTTON_WIDTH,
          }}
        >
          <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <InstagramIcon width={24} height={24} sx={{ display: 'block' }} />
            <Text sx={{ marginLeft: 's', position: 'relative', top: -2 }}>
              {text}
            </Text>
          </Flex>
        </Button>
      </a>
    </Link>
  );
}

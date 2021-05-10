/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Text, Button } from 'theme-ui';

import TwitterIcon from 'assets/icons/twitter-icon.svg';
import InstagramIcon from 'assets/icons/instagram-icon.svg';

import Link from './Link';
import { SocialVerifService } from 'types/SocialVerification';

import { VariantOptions } from 'types/ButtonVariantOptions';
import { BUTTON_WIDTH } from 'utils/buttons';
interface SocialVerifyLinkProps {
  text?: string;
  variant?: VariantOptions;
  redirectPath: string;
  service?: SocialVerifService;
}

export default function SocialVerifyLink(
  props: SocialVerifyLinkProps
): JSX.Element {
  const {
    text,
    variant = VariantOptions.outline,
    redirectPath,
    service = SocialVerifService.TWITTER,
  } = props;

  const serviceLowercase = service.toLowerCase();
  return (
    <Flex>
      <Link
        href={{
          pathname: `/profile/verify/${serviceLowercase}`,
          query: { 'redirect-path': redirectPath },
        }}
      >
        <a sx={{ display: 'block' }}>
          <Button
            variant={variant}
            type="button"
            sx={{
              width: BUTTON_WIDTH,
              // paddingRight: '36px !important',
              justifyContent: 'flex-end',
            }}
          >
            <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
              {service === SocialVerifService.INSTAGRAM ? (
                <InstagramIcon
                  width={24}
                  height={24}
                  sx={{ display: 'block' }}
                />
              ) : (
                <TwitterIcon width={24} height={24} sx={{ display: 'block' }} />
              )}
              <Text sx={{ marginLeft: 's', position: 'relative', top: -2 }}>
                {text}
              </Text>
            </Flex>
          </Button>
        </a>
      </Link>
    </Flex>
  );
}

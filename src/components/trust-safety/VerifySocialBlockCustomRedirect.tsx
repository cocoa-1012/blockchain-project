/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import {
  jsx,
  Box,
  Heading,
  Grid,
  Flex,
  Text,
  ThemeUIStyleObject,
  Button,
} from 'theme-ui';
import { useRouter } from 'next/router';
import { Global, css } from '@emotion/react';

import VerifiedBadge from 'assets/icons/verified-badge.svg';
import TwitterVerifyLink from 'components/links/SocialVerifyLink';
import InstagramVerifyPageLink from 'components/links/SocialVerifyLink';

import { SocialVerifService } from 'types/SocialVerification';
import { VariantOptions } from 'types/ButtonVariantOptions';

import { BUTTON_WIDTH } from 'utils/buttons';

interface VerifySocialBlockCustomRedirectProps {
  redirectPath?: string;
  handleSkip?: () => void;
  className?: string;
}

export default function VerifySocialBlockCustomRedirect(
  props: VerifySocialBlockCustomRedirectProps
): JSX.Element {
  const { redirectPath, handleSkip, className } = props;

  const sx = getStyles();

  const router = useRouter();

  return (
    <>
      {/* these styles override the layout styles when in the context
      of the transaction flow */}
      <Global
        styles={css`
          .transaction-container {
            grid-template-columns: 1fr;
            padding-top: 96px;
            padding-bottom: 128px;
          }
          .transaction-container,
          .transaction-content {
            display: flex;
            flex: 1;
            flex-direction: column;
          }
          .transaction-card {
            display: none;
          }
        `}
      />
      <Flex sx={sx.container} className={className}>
        <Grid gap="l">
          <Flex sx={{ justifyContent: 'center' }}>
            <VerifiedBadge sx={{ display: 'block' }} width={106} height={106} />
          </Flex>

          <Heading variant="h.l" sx={{ textAlign: 'center' }}>
            Please verify your profile.
          </Heading>
          <Grid gap="l">
            <Text sx={sx.text} variant="body.body">
              Verify your profile via at least one social media account to prove
              the authenticity of your profile on Foundation.
            </Text>

            <Grid sx={{ justifyContent: 'center' }}>
              <Box sx={{ paddingBottom: 'xs', width: BUTTON_WIDTH }}>
                <TwitterVerifyLink
                  text="Verify via Twitter"
                  redirectPath={redirectPath ?? router.asPath}
                  variant={VariantOptions.ghostGraySmall}
                />
              </Box>
              <Box sx={{ width: BUTTON_WIDTH }}>
                <InstagramVerifyPageLink
                  text="Verify via Instagram"
                  redirectPath={redirectPath ?? router.asPath}
                  variant={VariantOptions.ghostGraySmall}
                  service={SocialVerifService.INSTAGRAM}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {handleSkip && (
          <Box sx={sx.skip}>
            <Button
              onClick={handleSkip}
              variant={VariantOptions.ghostGray}
              sx={{ width: 140 }}
            >
              Skip
            </Button>
          </Box>
        )}
      </Flex>
    </>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    maxWidth: 540,
    marginX: 'auto',
    flex: 1,
    alignItems: 'center',
    paddingBottom: 'xl',
    position: 'relative',
  };

  const text: ThemeUIStyleObject = {
    maxWidth: 370,
    marginX: 'auto',
    textAlign: 'center',
  };

  const skip: ThemeUIStyleObject = {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
  };

  return { container, text, skip };
};

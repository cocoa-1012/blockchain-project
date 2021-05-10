/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, ThemeUIStyleObject, Flex, Button } from 'theme-ui';

import AuthContainer from 'components/auth/AuthContainer';
import AuthHeading from 'components/auth/AuthHeading';
import Link from 'components/links/Link';

interface ApprovedCreatorErrorProps {
  className?: string;
}

export default function ApprovedCreatorError(
  props: ApprovedCreatorErrorProps
): JSX.Element {
  const { className } = props;
  return (
    <AuthContainer className={className}>
      <Flex sx={{ flexDirection: 'column', maxWidth: 600, marginX: 'auto' }}>
        <AuthHeading variant="h.m" sx={{ maxWidth: 'none', marginBottom: 's' }}>
          You're not an approved creator
        </AuthHeading>

        <Text variant="body.body" sx={sx.smallText}>
          The wallet that is currently connected is not approved to be a creator
          on Foundation.
        </Text>

        <Flex sx={{ justifyContent: 'center' }}>
          <Link href="/artworks">
            <a>
              <Button
                variant="outline"
                sx={{ borderRadius: 999, backgroundColor: 'transparent' }}
              >
                Explore Foundation
              </Button>
            </a>
          </Link>
        </Flex>
      </Flex>
    </AuthContainer>
  );
}
const smallText: ThemeUIStyleObject = {
  color: 'black.100',
  fontSize: 16,
  lineHeight: 1.7,
  paddingX: 30,
  textAlign: 'center',
  marginX: 'auto',
  marginBottom: 'l',
  maxWidth: 320,
};
const sx = {
  smallText: smallText,
};

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Button, Box } from 'theme-ui';
import Link from 'next/link';

import ModalContainer from 'components/modals/common/ModalContainer';
import ModalContent from 'components/modals/common/ModalContent';
import ModalCopy from 'components/modals/common/ModalCopy';
import ModalHeading from 'components/modals/common/ModalHeading';

import { ModalKey } from 'types/modal';

export default function MobileNotSupportedModal(): JSX.Element {
  return (
    <>
      <ModalContainer
        modalKey={ModalKey.MOBILE_NOT_SUPPORTED}
        blockOverlayDismiss
      >
        <ModalContent sx={{ maxWidth: 600, flexShrink: 0 }}>
          <ModalHeading sx={{ maxWidth: 'none', marginBottom: 'm' }}>
            This action is currently not supported on mobile.
          </ModalHeading>
          <ModalCopy sx={{ fontSize: 'sub', maxWidth: 280 }}>
            Please use a laptop or desktop while we continue to build out mobile
            support.
          </ModalCopy>
          <Box sx={{ mt: 's', textAlign: 'center' }}>
            <Link href="/" passHref>
              <Button as="a">Back to Home</Button>
            </Link>
          </Box>
        </ModalContent>
      </ModalContainer>
    </>
  );
}

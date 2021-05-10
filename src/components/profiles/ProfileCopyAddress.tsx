/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Text } from 'theme-ui';
import { useCopyToClipboard } from 'react-use';
import { useEffect, useState } from 'react';

import UserNumber, { TagWrapper } from 'components/UserNumber';
import { truncateStringCenter } from 'utils/helpers';

import ClipboardIcon from 'assets/icons/clipboard-icon.svg';
import ClipboardCheck from 'assets/icons/clipboard-check.svg';
import { transitions } from 'utils/themes/main/theme';

interface ProfileCopyAddressProps {
  publicKey: string;
  userIndex?: number;
}

const sx = {
  tag: {
    boxShadow: 's',
    borderRadius: 48,
    alignItems: 'center',
    minHeight: [28, 35],
  },
};

export default function ProfileCopyAddress(
  props: ProfileCopyAddressProps
): JSX.Element {
  const { userIndex, publicKey } = props;
  return (
    <TagWrapper>
      <Flex sx={sx.tag}>
        {userIndex && <UserNumber userNumber={userIndex} />}
        <Text
          variant="mono.sub"
          sx={{ letterSpacing: 0.6, paddingLeft: 12, fontSize: [12, 'sub'] }}
        >
          {truncateStringCenter(4, publicKey)}
        </Text>
        <CopyToClipboardLink textToCopy={publicKey} />
      </Flex>
    </TagWrapper>
  );
}

interface CopyToClipboardLinkProps {
  textToCopy: string;
}

function CopyToClipboardLink(props: CopyToClipboardLinkProps): JSX.Element {
  const { textToCopy } = props;
  const [clipboardState, copyToClipboard] = useCopyToClipboard();
  const [noticationKey, setNotificationKey] = useState(null);
  const [hasCopied, setHasCopied] = useState(null);

  function handleCopy() {
    setHasCopied(true);
    setNotificationKey(Date.now());
    copyToClipboard(textToCopy);
  }

  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2500);
  }, [noticationKey]);

  const hasValue = clipboardState.value && hasCopied;

  return (
    <Flex
      {...getToolTipProps(hasValue)}
      onClick={handleCopy}
      sx={{
        paddingX: 10,
        minHeight: [29, 35],
        alignItems: 'center',
        cursor: 'pointer',
        color: 'black.20',
        transition: transitions.smooth.fast,
        '@media (hover: hover)': {
          '&:hover': {
            color: 'black.100',
          },
        },
      }}
    >
      {hasValue ? (
        <ClipboardCheck sx={{ display: 'block' }} width={16} height={12} />
      ) : (
        <ClipboardIcon sx={{ display: 'block' }} width={16} height={16} />
      )}
    </Flex>
  );
}

const getToolTipProps = (value) =>
  !value && { 'aria-label': 'Copy Address', 'data-balloon-pos': 'up' };

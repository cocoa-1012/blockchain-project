/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Text } from 'theme-ui';

import CircleAvatar from 'components/avatars/CircleAvatar';
import GraySquare from 'components/GraySquare';

import { transitions } from 'utils/themes/main/theme';
import { formatETHWithSuffix } from 'utils/formatters';
import { truncateStringCenter } from 'utils/helpers';

import useIsWrongNetwork from 'hooks/web3/use-is-wrong-network';

interface UserDropdownButtonProps {
  isLoading: boolean;
  balance: number;
  pendingBalance?: number;
  publicKey: string;
  avatarUrl?: string;
}

export default function UserDropdownButton(
  props: UserDropdownButtonProps
): JSX.Element {
  const { isLoading, balance, avatarUrl, publicKey } = props;

  const sx = getStyles();

  const { isWrongNetwork } = useIsWrongNetwork();

  return (
    <Flex sx={sx.button}>
      <Flex
        sx={{
          alignItems: 'center',
          bg: 'white.100',
          paddingRight: 6,
          borderRadius: 999,
          paddingLeft: [6, null, 'm'],
          paddingY: 6,
        }}
      >
        <Flex
          sx={{
            marginRight: 's',
            textAlign: 'right',
            flexDirection: 'column',
            alignItems: 'flex-end',
            display: ['none', null, 'flex'],
          }}
        >
          {isLoading ? (
            <>
              <GraySquare
                height={22}
                width={88}
                sx={{ bg: 'black.5', marginBottom: 2 }}
              />
              <GraySquare height={15} width={98} sx={{ bg: 'black.5' }} />
            </>
          ) : (
            <>
              {isWrongNetwork ? (
                <Text variant="h.xs" sx={{ marginBottom: 2 }}>
                  Wrong network
                </Text>
              ) : (
                <Text variant="h.xs" sx={{ marginBottom: 2 }}>
                  {formatETHWithSuffix(balance)}
                </Text>
              )}

              <Text variant="mono.sub" sx={{ fontSize: 12 }}>
                {truncateStringCenter(4, publicKey)}
              </Text>
            </>
          )}
        </Flex>
        <CircleAvatar imageUrl={avatarUrl} size={42} />
      </Flex>
    </Flex>
  );
}

const getStyles = () => ({
  button: {
    bg: 'black.5',
    boxShadow: 's',
    alignItems: 'center',
    borderRadius: 999,
    marginLeft: 'auto',
    transition: transitions.smooth.fast,
    cursor: 'pointer',
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 'm',
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: 's',
      },
    },
  },
});

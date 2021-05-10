/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';

import ExternalLinkIcon from 'assets/icons/external-link.svg';
import { buildEtherscanLink } from 'lib/etherscanAddresses';
import { transitions } from 'utils/themes/main/theme';
import { textAlignCenter } from 'types/styles';

interface TransactionHashLinkProps {
  txHash: string | string[];
}

export default function TransactionHashLink(
  props: TransactionHashLinkProps
): JSX.Element {
  const { txHash } = props;

  const etherscanLink = buildEtherscanLink(`/tx/${txHash}`);

  const sx = getStyles();

  return (
    <a
      href={etherscanLink}
      sx={{ ...sx.link, color: 'black.60' }}
      target="_blank"
      rel="noreferrer"
    >
      <ExternalLinkIcon sx={{ display: 'block' }} />
      <Text
        variant="h.body"
        sx={{ marginLeft: 's', position: 'relative', top: -1 }}
      >
        View on Etherscan
      </Text>
    </a>
  );
}

export function TransactionHashLinkMinimal(
  props: TransactionHashLinkProps
): JSX.Element {
  const { txHash } = props;

  const sx = getStyles();

  const etherscanLink = buildEtherscanLink(`/tx/${txHash}`);
  return (
    <a
      href={etherscanLink}
      sx={{ ...sx.link, color: 'black.40' }}
      target="_blank"
      rel="noreferrer"
    >
      <ExternalLinkIcon sx={{ display: 'block' }} />
    </a>
  );
}

const getStyles = () => ({
  link: {
    textAlign: textAlignCenter,
    color: 'inherit',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    transition: transitions.smooth.fast,
    '@media (hover: hover)': {
      '&:hover': {
        color: 'black.100',
      },
    },
  },
});

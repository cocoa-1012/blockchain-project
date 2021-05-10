/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Button, Flex, ThemeUIStyleObject } from 'theme-ui';

interface ETHBalanceProps {
  balance: string | number;
  onMaxClick?: () => void;
  formatter: (arg0: unknown) => string;
  className?: string;
}

export default function ETHBalance(props: ETHBalanceProps): JSX.Element {
  const { balance, onMaxClick, formatter, className } = props;

  const sx = getStyles();

  return (
    <Flex sx={sx.container} className={className}>
      <Text variant="h.body" sx={{ color: 'black.60' }}>
        Your Balance
      </Text>
      <Flex sx={{ alignItems: 'center', minHeight: 26 }}>
        <Text variant="h.xs">{formatter(balance)}</Text>
        {onMaxClick && (
          <Button
            variant="tiny"
            type="button"
            sx={sx.button}
            onClick={onMaxClick}
          >
            Max
          </Button>
        )}
      </Flex>
    </Flex>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 'm',
    paddingY: 20,
    paddingRight: 20,
    backgroundColor: 'black.10',
  };

  const button: ThemeUIStyleObject = {
    borderWidth: 1,
    fontSize: 10,
    marginLeft: 'xs',
  };

  return { container, button };
};

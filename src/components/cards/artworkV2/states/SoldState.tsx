/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Box, Flex, Button } from 'theme-ui';
import Link from 'next/link';
import { formatETHWithSuffix } from 'utils/formatters';
import { positionRelative } from 'types/styles';

interface SoldStateProps {
  isOwner: boolean;
  soldPrice: number;
  settlePath: string;
}

export default function SoldState(props: SoldStateProps): JSX.Element {
  const { isOwner, soldPrice, settlePath } = props;

  return (
    <Flex
      sx={{
        alignItems: 'center',
        backgroundColor: 'black.5',
        borderTop: '1px solid',
        borderColor: 'black.10',
        paddingX: 'm',
        paddingY: 'm',
      }}
    >
      <Box>
        <Text
          variant="stnd.xs"
          sx={{ fontWeight: 600, color: 'black.50', marginBottom: 'xxs' }}
        >
          Sold for
        </Text>
        <Text variant="stnd.xs" sx={{ fontWeight: 600 }}>
          {formatETHWithSuffix(soldPrice)}
        </Text>
      </Box>

      {isOwner && (
        <Box sx={{ marginLeft: 'auto' }}>
          <Link href={settlePath}>
            <Button
              as="a"
              variant="outline"
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderColor: 'black.10',
                position: positionRelative,
                zIndex: 2,
                '@media (hover: hover)': {
                  '&:hover': {
                    borderColor: 'black.100',
                  },
                },
              }}
            >
              Settle auction
            </Button>
          </Link>
        </Box>
      )}
    </Flex>
  );
}

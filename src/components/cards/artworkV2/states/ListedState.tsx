/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Box, Flex, Button } from 'theme-ui';
import Link from 'next/link';
import { formatETHWithSuffix } from 'utils/formatters';
import { positionRelative } from 'types/styles';

interface ListedStateProps {
  isOwner: boolean;
  reservePrice: string;
  bidPath: string;
}

export default function ListedState(props: ListedStateProps): JSX.Element {
  const { isOwner, reservePrice, bidPath } = props;

  return (
    <Flex
      sx={{
        alignItems: 'center',
        backgroundColor: 'white.100',
        borderTop: '1px solid',
        borderColor: 'black.5',
        paddingX: 'm',
        paddingY: 'm',
      }}
    >
      <Box>
        <Text
          variant="stnd.xs"
          sx={{ fontWeight: 600, color: 'black.50', marginBottom: 'xxs' }}
        >
          Reserve price
        </Text>
        <Text variant="stnd.xs" sx={{ fontWeight: 600 }}>
          {formatETHWithSuffix(reservePrice)}
        </Text>
      </Box>

      {!isOwner && (
        <Box sx={{ marginLeft: 'auto' }}>
          <Link href={bidPath}>
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
              Place a bid
            </Button>
          </Link>
        </Box>
      )}
    </Flex>
  );
}

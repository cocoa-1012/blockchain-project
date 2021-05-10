/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Box, Flex, Button } from 'theme-ui';
import Link from 'next/link';

import FollowPopover from 'components/follows/FollowPopover';
import UserTag from 'components/users/UserTag';

import { positionRelative } from 'types/styles';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

import { formatETHWithSuffix } from 'utils/formatters';

interface SettledStateProps {
  isOwner: boolean;
  ownerAddress: string;
  soldPrice: number;
  listPath: string;
}

export default function SettledState(props: SettledStateProps): JSX.Element {
  const { isOwner, soldPrice, listPath, ownerAddress } = props;

  const { data: ownerData, isLoading: isOwnerLoading } = useUserByPublicKey({
    publicKey: ownerAddress,
    refetchOnWindowFocus: false,
    enabled: !isOwner,
  });

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
          <Link href={listPath}>
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
              List NFT
            </Button>
          </Link>
        </Box>
      )}

      {!isOwner && (
        <Box sx={{ marginLeft: 'auto', position: positionRelative, zIndex: 2 }}>
          <FollowPopover publicKey={ownerData?.user?.publicKey}>
            <UserTag user={ownerData?.user} isLoading={isOwnerLoading} />
          </FollowPopover>
        </Box>
      )}
    </Flex>
  );
}

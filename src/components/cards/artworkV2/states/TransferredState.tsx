/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Box, Flex } from 'theme-ui';

import FollowPopover from 'components/follows/FollowPopover';
import UserTag from 'components/users/UserTag';

import { positionRelative } from 'types/styles';

import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';

interface TransferredStateProps {
  ownerAddress: string;
}

export default function TransferredState(
  props: TransferredStateProps
): JSX.Element {
  const { ownerAddress } = props;

  const { data: ownerData, isLoading: isOwnerLoading } = useUserByPublicKey({
    publicKey: ownerAddress,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const hasUserinDB = Boolean(ownerData?.user);

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
          Owned by
        </Text>
      </Box>

      <Box sx={{ marginLeft: 'auto', position: positionRelative, zIndex: 2 }}>
        {hasUserinDB ? (
          <FollowPopover publicKey={ownerData?.user?.publicKey}>
            <UserTag user={ownerData?.user} isLoading={isOwnerLoading} />
          </FollowPopover>
        ) : (
          <UserTag user={{ publicKey: ownerAddress }} />
        )}
      </Box>
    </Flex>
  );
}

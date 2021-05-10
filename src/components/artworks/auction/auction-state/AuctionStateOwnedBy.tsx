/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Text } from 'theme-ui';
import { ReactElement } from 'react';
import { useMeasure, useMountedState } from 'react-use';

import {
  ArtworkAuctionContainer,
  ArtworkAuctionMetaContainer,
} from '../ArtworkAuctionElements';
import FollowPopover from 'components/follows/FollowPopover';
import UserTagDynamic from 'components/users/UserTagDynamic';

import { getAuctionPriceStyle } from './styles';

interface AuctionStateOwnedByProps {
  ownedBy: string;
  children?: ReactElement;
}

export default function AuctionStateOwnedBy(
  props: AuctionStateOwnedByProps
): JSX.Element {
  const { ownedBy, children } = props;

  const isMounted = useMountedState();
  const [measureRef, { width }] = useMeasure();
  const isNarrow = Boolean(isMounted && width < 500);

  return (
    <ArtworkAuctionContainer ref={measureRef}>
      <ArtworkAuctionMetaContainer
        sx={{
          paddingBottom: 'l',
          '& .auction-meta': getAuctionPriceStyle(isNarrow),
        }}
        isNarrow={isNarrow}
      >
        {children}

        <Flex sx={{ flexDirection: 'column' }}>
          <Text variant="h.body" sx={{ marginBottom: 5 }}>
            Owned by
          </Text>
          <Flex sx={{ marginY: 'auto' }}>
            <FollowPopover publicKey={ownedBy}>
              <UserTagDynamic publicKey={ownedBy} />
            </FollowPopover>
          </Flex>
        </Flex>
      </ArtworkAuctionMetaContainer>
    </ArtworkAuctionContainer>
  );
}

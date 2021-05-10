/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useMeasure, useMountedState } from 'react-use';
import { ReactNode } from 'react';

import {
  ArtworkAuctionContainer,
  ArtworkAuctionMetaContainer,
} from '../ArtworkAuctionElements';
import ArtworkAuctionPrice from '../ArtworkAuctionPrice';
import ArtworkAuctionBidAction from '../ArtworkAuctionBidAction';

import { getAuctionPriceStyle } from './styles';

import Bid from 'types/Bid';

interface AuctionStateGenericProps {
  amountInETH: string;
  children: ReactNode;
  myBid?: Bid;
  minutesRemaining: number;
  bidPath: string;
  label: string;
}

export default function AuctionStateGeneric(
  props: AuctionStateGenericProps
): JSX.Element {
  const {
    amountInETH,
    label,
    children,
    myBid,
    minutesRemaining,
    bidPath,
  } = props;

  const isMounted = useMountedState();
  const [measureRef, { width }] = useMeasure();
  const isNarrow = Boolean(isMounted && width < 500);

  return (
    <ArtworkAuctionContainer ref={measureRef}>
      <ArtworkAuctionMetaContainer isNarrow={isNarrow}>
        <ArtworkAuctionPrice
          label={label}
          amountInETH={amountInETH}
          sx={getAuctionPriceStyle(isNarrow)}
        />
        {children}
      </ArtworkAuctionMetaContainer>
      <ArtworkAuctionBidAction
        myBid={myBid}
        minutesRemaining={minutesRemaining}
        bidPath={bidPath}
      />
    </ArtworkAuctionContainer>
  );
}

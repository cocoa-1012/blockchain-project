/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box } from 'theme-ui';
import { useEffect, useState } from 'react';
import { useMeasure } from 'react-use';
import { length } from 'ramda';

import useAccountBids from 'hooks/queries/subgraph/use-account-bids';

import { getBidsForActivity, rejectLostBids } from 'utils/bids/bids';

import LogoLink from 'components/links/LogoLink';
import UserDropdown from 'components/headers/UserDropdown';
import HeaderBidsLink from './HeaderBidsLink';
// TODO: Consider renaming to something shorter
import HeaderCreatorUploadLink from 'components/headers/HeaderCreatorUploadLink';
import HeaderContainer from 'components/headers/HeaderContainer';
import MobileHeaderOpenButton from './MobileHeaderOpenButton';
import MobileHeader from './MobileHeader';
import SearchBar from 'components/search/SearchBar';

import { SharedHeaderProps } from 'components/headers/types';

import { headerContainerStyles, overlayStyles } from './styles';
import MobileHeaderSearchButton from './MobileHeaderSearchButton';

import NotificationsDropdown from 'components/notifications/NotificationsDropdown';
import SubNav from './SubNav';

interface AuthHeaderProps extends SharedHeaderProps {
  isApprovedCreator: boolean;
  publicAddress: string;
  isDark?: boolean;
}

function useBidCount(publicAddress: string): number {
  const { data } = useAccountBids(publicAddress);

  const bidsPlaced = data?.placedBids ?? [];
  const bidsReceived = data?.receivedBids?.nftMarketAuctions ?? [];

  const bids = rejectLostBids(bidsPlaced);

  const activeBids = getBidsForActivity(bids);

  return length([...activeBids, ...bidsReceived]);
}

export default function AuthHeader(props: AuthHeaderProps): JSX.Element {
  const { color, absolute, publicAddress, className, mode, isDark } = props;

  const [isNavOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [measureRef, { height: viewportHeight }] = useMeasure();

  const logoColor = isNavOpen ? 'black.100' : color;

  const bidCount = useBidCount(publicAddress);

  useEffect(() => {
    setNavOpen(false);
  }, [searchOpen]);

  return (
    <>
      <Box sx={overlayStyles} ref={measureRef} />
      <MobileHeader
        viewportHeight={viewportHeight}
        isOpen={isNavOpen}
        isConnected={true}
      />
      <HeaderContainer absolute={absolute} className={className}>
        <Flex className="header-inner" sx={headerContainerStyles}>
          {!searchOpen && (
            <Flex sx={{ color: logoColor }}>
              <LogoLink color={logoColor} />
            </Flex>
          )}

          <SearchBar pageColorMode={mode} searchOpen={searchOpen} />

          <Flex sx={{ alignItems: 'center' }}>
            <Flex
              sx={{ display: ['none', null, 'flex'], alignItems: 'center' }}
            >
              <HeaderBidsLink
                sx={{ marginRight: 'l', color }}
                bidCount={bidCount}
              />
              <HeaderCreatorUploadLink sx={{ marginRight: 'm', color }} />
              <NotificationsDropdown />
            </Flex>

            <Flex>
              {!searchOpen && <UserDropdown bidCount={bidCount} />}

              <MobileHeaderSearchButton
                isOpen={searchOpen}
                setOpen={setSearchOpen}
              />
              {!searchOpen && (
                <MobileHeaderOpenButton
                  isOpen={isNavOpen}
                  setOpen={setNavOpen}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
        <SubNav isLoggedIn isDark={isDark} />
      </HeaderContainer>
    </>
  );
}

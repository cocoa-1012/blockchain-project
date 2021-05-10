import { styled, css } from 'stitches.config';
import { CellProps } from 'react-table';
import Link from 'next/link';

import { formatETHWithSuffix } from 'utils/formatters';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import ETHinUSD from 'components/ETHinUSD';
import FollowPopover from 'components/follows/FollowPopover';
import TrendingName from './TrendingName';
import TrendingUsername from './TrendingUsername';
import SingleValue from './SingleValue';
import SubValue from './SubValue';
import RankValue from './RankValue';

import {
  TimeFilter,
  TrendingCreator,
  TrendingCreatorColumn,
} from 'types/Trending';
import CircleAvatar from 'components/avatars/CircleAvatar';
import {
  getUsernameOrTruncatedAddress,
  hasUsername,
  publicKeyOrIdOrAddress,
} from 'utils/helpers';
import { getTimeFilterPrefix } from 'utils/trending';
import { buildUserProfilePath } from 'utils/artwork/artwork';

const Header = styled(Box, {
  display: 'none',
  fontFamily: '$body',
  fontWeight: 600,
  color: '$black60',
  fontSize: '$1',
  paddingX: '$2',
  cursor: 'pointer',
  '@bp2': { display: 'block' },
  variants: {
    isActive: { true: { color: '$black100' } },
  },
});

const popoverStyles = css({
  position: 'relative',
  zIndex: 3,
  display: 'flex',
})();

const ALink = styled(Flex, {
  alignItems: 'center',
  textDecoration: 'none',
  color: 'currentcolor',
});

export default function TrendingCreatorColumns(
  activeTimeFilter: TimeFilter,
  isMobile: boolean
) {
  return [
    {
      id: 'rank',
      width: 50,
      Header: function RankHeader() {
        return (
          <Box css={{ paddingLeft: '$4', '@bp2': { paddingLeft: '$2' } }}>
            Rank
          </Box>
        );
      },
      Cell: function RankCell({ row, column }: CellProps<TrendingCreator>) {
        if (isMobile) {
          column.width = 40;
        }

        return <RankValue>#{row.index + 1}</RankValue>;
      },
    },
    {
      id: 'user',
      width: 250,
      Cell: function UserCell({ row, column }: CellProps<TrendingCreator>) {
        if (isMobile) {
          column.width = 180;
        }
        const {
          original: { user },
        } = row;

        const userHasUsername = hasUsername(user);
        const userHasName = user.name;
        const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(user);
        const creatorProfilePath = buildUserProfilePath({
          user: user,
        });

        return (
          <Flex css={{ alignItems: 'center' }}>
            <FollowPopover
              publicKey={publicKeyOrIdOrAddress(user)}
              className={popoverStyles}
            >
              <Link href={creatorProfilePath} passHref>
                <ALink as="a">
                  <CircleAvatar
                    size={[30, null, null, 50]}
                    userIndex={user.userIndex}
                    imageUrl={user.profileImageUrl}
                  />
                  <Box
                    css={{
                      marginLeft: '$3',
                      overflow: 'hidden',
                      '@bp1': { marginLeft: '$5' },
                    }}
                  >
                    {userHasName && <TrendingName>{user.name}</TrendingName>}
                    <TrendingUsername
                      color={userHasUsername ? 'rainbow' : null}
                      hasNoUsername={!userHasUsername}
                      hasNoName={!userHasName}
                    >
                      {usernameOrTruncatedAddress}
                    </TrendingUsername>
                  </Box>
                </ALink>
              </Link>
            </FollowPopover>
          </Flex>
        );
      },
    },
    {
      id: TrendingCreatorColumn.UniqueCollectors,
      canSort: true,
      width: 150,
      Header: function CollectorsHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCreator>) {
        return (
          <Header onClick={() => toggleSortBy()} isActive={isSorted}>
            Unique Collectors
          </Header>
        );
      },
      Cell: function CollectorsCell({
        row: { original },
      }: CellProps<TrendingCreator>) {
        const queryField = `${getTimeFilterPrefix(activeTimeFilter)}Collectors`;
        return (
          <Box css={{ textAlign: 'right', '@bp1': { textAlign: 'left' } }}>
            <SingleValue>{original[queryField]}</SingleValue>
          </Box>
        );
      },
    },
    {
      id: TrendingCreatorColumn.NftsSold,
      canSort: true,
      width: 100,
      Header: function NftsSoldHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCreator>) {
        return (
          <Header onClick={() => toggleSortBy()} isActive={isSorted}>
            NFTs Sold
          </Header>
        );
      },
      Cell: function SoldCell({
        row: { original },
      }: CellProps<TrendingCreator>) {
        const queryField = `${getTimeFilterPrefix(activeTimeFilter)}NumSold`;
        return (
          <Box css={{ textAlign: 'right', '@bp1': { textAlign: 'left' } }}>
            <SingleValue>{original[queryField]}</SingleValue>
          </Box>
        );
      },
    },
    {
      id: TrendingCreatorColumn.PrimarySales,
      canSort: true,
      Header: function PrimarySalesHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCreator>) {
        return (
          <Header
            onClick={() => toggleSortBy()}
            isActive={isSorted}
            css={{ textAlign: 'right' }}
          >
            Primary Sales
          </Header>
        );
      },
      Cell: function PrimaryVolCell({
        row: { original },
      }: CellProps<TrendingCreator>) {
        const queryField = `${getTimeFilterPrefix(activeTimeFilter)}PrimaryVol`;
        return (
          <Box css={{ textAlign: 'right' }}>
            <SingleValue css={{ marginBottom: '$1' }}>
              {formatETHWithSuffix(original[queryField])}
            </SingleValue>
            <SubValue>
              <ETHinUSD amount={original[queryField]} />
            </SubValue>
          </Box>
        );
      },
    },
    {
      id: TrendingCreatorColumn.SecondarySales,
      canSort: true,
      Header: function SecondarySalesHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCreator>) {
        return (
          <Header
            onClick={() => toggleSortBy()}
            isActive={isSorted}
            css={{ textAlign: 'right' }}
          >
            Secondary Sales
          </Header>
        );
      },
      Cell: function SecondaryVolCell({
        row: { original },
      }: CellProps<TrendingCreator>) {
        const queryField = `${getTimeFilterPrefix(
          activeTimeFilter
        )}SecondaryVol`;
        return (
          <Box css={{ textAlign: 'right' }}>
            <SingleValue css={{ marginBottom: '$1' }}>
              {formatETHWithSuffix(original[queryField])}
            </SingleValue>
            <SubValue>
              <ETHinUSD amount={original[queryField]} />
            </SubValue>
          </Box>
        );
      },
    },
    {
      id: TrendingCreatorColumn.TotalVolume,
      canSort: true,
      Header: function TotalVolHeader({
        column: { isSorted, toggleSortBy },
      }: CellProps<TrendingCreator>) {
        return (
          <Header
            onClick={() => toggleSortBy()}
            isActive={isSorted}
            css={{ textAlign: 'right' }}
          >
            Total Sales
          </Header>
        );
      },
      Cell: function TotalVolHeader({
        row: { original },
        column,
      }: CellProps<TrendingCreator>) {
        if (isMobile) {
          column.width = 100;
        }
        const queryField = `${getTimeFilterPrefix(activeTimeFilter)}Vol`;
        return (
          <Box css={{ textAlign: 'right', '@bp2': { paddingRight: '$3' } }}>
            <SingleValue css={{ marginBottom: '$1' }}>
              {formatETHWithSuffix(original[queryField])}
            </SingleValue>
            <SubValue>
              <ETHinUSD amount={original[queryField]} />
            </SubValue>
          </Box>
        );
      },
    },
  ];
}

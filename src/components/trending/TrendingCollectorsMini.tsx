/* eslint-disable react/jsx-max-depth */
import { styled } from 'stitches.config';
import { useMemo, useState } from 'react';
import { compose, flatten, propOr } from 'ramda';
import { InfiniteData } from 'react-query';

import { TimeFilter } from 'types/Trending';
import { TrendingCollector } from 'types/Trending';

import { buildUserProfilePath } from 'utils/artwork/artwork';
import {
  getUsernameOrTruncatedAddress,
  hasUsername,
  publicKeyOrIdOrAddress,
} from 'utils/helpers';
import { formatETHWithSuffix } from 'utils/formatters';
import {
  getTimeFilterPrefix,
  getTrendingCollectorOrderByField,
} from 'utils/trending';

import CircleAvatar from 'components/avatars/CircleAvatar';
import TrendingUser from './TrendingUser';
import TrendingName from 'components/trending/TrendingName';
import TrendingUsername from 'components/trending/TrendingUsername';
import SingleValue from 'components/trending/SingleValue';
import SubValue from 'components/trending/SubValue';
import ETHinUSD from 'components/ETHinUSD';
import Flex from 'components/base/Flex';
import TrendingMiniHeading from './TrendingMiniHeading';
import GraySquare from 'components/base/GraySquare';
import RankValue from './RankValue';
import Box from 'components/base/Box';
import Link from 'components/links/Link';
import Text from 'components/base/Text';

import useTrendingCollectors from 'hooks/queries/hasura/use-trending-collectors';
import FollowPopover from 'components/follows/FollowPopover';

const getFlattenedData = compose<
  InfiniteData<TrendingCollector[]>,
  TrendingCollector[],
  TrendingCollector[]
>(flatten, propOr([], 'pages'));

const TrendingWrapper = styled('section', {
  fontFamily: '$body',
});

export default function TrendingCollectorsMini(): JSX.Element {
  const [activeTimeFilter, setTimeFilter] = useState(TimeFilter.OneDay);

  const orderByField = getTrendingCollectorOrderByField({
    timeFilter: activeTimeFilter,
    orderByColumn: 'TotalSpent',
  });

  const skeletonData = new Array(5).fill({});

  const { data, isLoading } = useTrendingCollectors({
    orderByField,
  });

  const flattenedData = useMemo(() => getFlattenedData(data), [data]);
  const queryField = `${getTimeFilterPrefix(activeTimeFilter)}Spent`;
  const onlyDataWithSales = flattenedData.filter((d) => {
    return d[queryField] > 0;
  });

  const users = isLoading ? skeletonData : onlyDataWithSales.slice(0, 5);

  return (
    <TrendingWrapper>
      <TrendingMiniHeading
        activeTimeFilter={activeTimeFilter}
        setTimeFilter={setTimeFilter}
        href="/trending?tab=collectors"
      >
        Trending Collectors
      </TrendingMiniHeading>
      <Text
        css={{
          color: '$black50',
          marginBottom: '$3',
          textAlign: 'center',
          '@bp4': { textAlign: 'left' },
        }}
      >
        Total Spent
      </Text>
      {users.map((user, index) => {
        const userHasUsername = hasUsername(user.user);
        const userHasName = user?.user?.name;
        const usernameOrTruncatedAddress = getUsernameOrTruncatedAddress(
          user.user
        );
        return (
          <Link key={index} href={buildUserProfilePath({ user: user.user })}>
            <TrendingUser as="a">
              <Flex css={{ alignItems: 'center', minWidth: 0 }}>
                <RankValue css={{ marginRight: '$5' }}>#{index + 1}</RankValue>
                <FollowPopover publicKey={publicKeyOrIdOrAddress(user.user)}>
                  <Flex css={{ alignItems: 'center' }}>
                    {isLoading ? (
                      <GraySquare
                        css={{ height: 50, width: 50, borderRadius: 100 }}
                      />
                    ) : (
                      <CircleAvatar
                        size={[30, null, null, 50]}
                        userIndex={user.user.userIndex}
                        imageUrl={user.user.profileImageUrl}
                      />
                    )}
                    <Box
                      css={{
                        marginLeft: '$3',
                        overflow: 'hidden',
                        '@bp1': { marginLeft: '$5' },
                      }}
                    >
                      {userHasName && (
                        <TrendingName>{user.user.name}</TrendingName>
                      )}
                      <Flex>
                        <TrendingUsername
                          color={userHasUsername ? 'rainbow' : null}
                          hasNoUsername={!userHasUsername}
                          hasNoName={!userHasName}
                        >
                          {usernameOrTruncatedAddress}
                        </TrendingUsername>
                      </Flex>
                    </Box>
                  </Flex>
                </FollowPopover>
              </Flex>
              {isLoading ? (
                <GraySquare />
              ) : (
                <Box
                  css={{ textAlign: 'right', '@bp2': { paddingRight: '$3' } }}
                >
                  <SingleValue css={{ marginBottom: '$1' }}>
                    {formatETHWithSuffix(user[queryField])}
                  </SingleValue>
                  <SubValue>
                    <ETHinUSD amount={user[queryField]} />
                  </SubValue>
                </Box>
              )}
            </TrendingUser>
          </Link>
        );
      })}
    </TrendingWrapper>
  );
}

/* eslint-disable react/jsx-max-depth */
import { styled } from 'stitches.config';
import { useMemo, useState } from 'react';
import { compose, flatten, propOr } from 'ramda';
import { InfiniteData } from 'react-query';

import { TimeFilter } from 'types/Trending';
import { TrendingCreator } from 'types/Trending';

import { buildUserProfilePath } from 'utils/artwork/artwork';
import {
  getUsernameOrTruncatedAddress,
  hasUsername,
  publicKeyOrIdOrAddress,
} from 'utils/helpers';
import { formatETHWithSuffix } from 'utils/formatters';
import {
  getTimeFilterPrefix,
  getTrendingCreatorOrderByField,
} from 'utils/trending';

import CircleAvatar from 'components/avatars/CircleAvatar';
import TrendingUser from './TrendingUser';
import TrendingName from './TrendingName';
import TrendingUsername from './TrendingUsername';
import SingleValue from './SingleValue';
import SubValue from './SubValue';
import ETHinUSD from 'components/ETHinUSD';
import Flex from 'components/base/Flex';
import TrendingMiniHeading from './TrendingMiniHeading';
import GraySquare from 'components/base/GraySquare';
import RankValue from './RankValue';
import Box from 'components/base/Box';
import Link from 'components/links/Link';
import Text from 'components/base/Text';

import useTrendingCreators from 'hooks/queries/hasura/use-trending-creators';
import FollowPopover from 'components/follows/FollowPopover';

const getFlattenedData = compose<
  InfiniteData<TrendingCreator[]>,
  TrendingCreator[],
  TrendingCreator[]
>(flatten, propOr([], 'pages'));

const TrendingWrapper = styled('section', {
  fontFamily: '$body',
});

export default function TrendingCreatorsMini(): JSX.Element {
  const [activeTimeFilter, setTimeFilter] = useState(TimeFilter.OneDay);

  const orderByField = getTrendingCreatorOrderByField({
    timeFilter: activeTimeFilter,
    orderByColumn: 'PrimarySales',
  });

  const skeletonData = new Array(5).fill({});

  const { data, isLoading } = useTrendingCreators({
    orderByField,
  });

  const flattenedData = useMemo(() => getFlattenedData(data), [data]);
  const queryField = `${getTimeFilterPrefix(activeTimeFilter)}PrimaryVol`;
  const onlyDataWithSales = flattenedData.filter((d) => {
    return d[queryField] > 0;
  });

  const users = isLoading ? skeletonData : onlyDataWithSales.slice(0, 5);

  return (
    <TrendingWrapper>
      <TrendingMiniHeading
        activeTimeFilter={activeTimeFilter}
        setTimeFilter={setTimeFilter}
        href="/trending"
      >
        Trending Creators
      </TrendingMiniHeading>

      <Text
        css={{
          color: '$black50',
          marginBottom: '$3',
          textAlign: 'center',
          '@bp4': { textAlign: 'left' },
        }}
      >
        Total Sales
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

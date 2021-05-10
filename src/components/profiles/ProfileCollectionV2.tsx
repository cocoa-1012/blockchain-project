/* eslint-disable max-lines */
import { useState } from 'react';
import { always, cond, equals, filter, find, path } from 'ramda';
import { useEffect } from 'react';

import ProfileCollectionPane from './ProfileCollectionPane';
import ProfileMigrated from './ProfileMigrated';
import ProfileCollectionTabLabel, {
  lastTabStyles,
} from './ProfileCollectionTabLabel';
import { TabsWithLabels, Tab } from 'components/tabs/Tabs';
import GraySquare from 'components/base/GraySquare';
import Flex from 'components/base/Flex';

import useUserArtworksCreated from 'hooks/queries/hasura/use-user-artworks-created';
import useUserArtworksCollected from 'hooks/queries/hasura/use-user-artworks-collected';
import useUserArtworksSplits from 'hooks/queries/hasura/use-user-artworks-splits';
import useUserArtworksHidden from 'hooks/queries/hasura/use-user-artworks-hidden';
import useUserArtworksCounts from 'hooks/queries/hasura/use-user-artworks-counts';

import { areKeysEqual, hasUserMigrated } from 'utils/users';
import { isEmptyOrNil } from 'utils/helpers';

import { UserArtworksCreatedVariables } from 'graphql/hasura/queries/user-artworks-created.generated';
import { UserArtworksCollectedVariables } from 'graphql/hasura/queries/user-artworks-collected.generated';
import { UserArtworksSplitsVariables } from 'graphql/hasura/queries/user-artworks-splits.generated';
import { UserArtworksHiddenVariables } from 'graphql/hasura/queries/user-artworks-hidden.generated';

import Account from 'types/Account';
import WalletUser from 'types/WalletUser';

enum CollectionTab {
  Created = 'Created',
  Collected = 'Collected',
  Splits = 'Splits',
  Hidden = 'Hidden',
}

interface ProfileCollectionV2Props {
  publicKey: string;
  currentUserPublicKey: string;
  user: Account;
  currentUser: WalletUser;
  currentUserIsLoading: boolean;
  createdCount: number;
}

interface TabVisibility extends Tab {
  isVisible: boolean;
}

export default function ProfileCollectionV2(
  props: ProfileCollectionV2Props
): JSX.Element {
  const {
    publicKey,
    currentUserPublicKey,
    user,
    currentUser,
    currentUserIsLoading,
    createdCount: createdCountInitial,
  } = props;

  const isCurrentUserProfile = areKeysEqual([publicKey, currentUserPublicKey]);
  const isUserMigrated = hasUserMigrated(user);

  // if a user is viewing their own profile or an admin
  // is viewing it then query for non-indexed artworks too
  const indexedStates =
    currentUser?.admin || isCurrentUserProfile ? [true, false] : [true];

  const { data, isLoading: isCountsLoading } = useUserArtworksCounts(
    { publicKey, indexedStates },
    { refetchOnWindowFocus: false }
  );

  const createdCount = data?.artworksCreated ?? createdCountInitial;
  const collectedCount = data?.artworksCollected;
  const splitsCount = data?.artworksSplits;
  const hiddenCount = data?.artworksHidden;

  const [currentTab, setCurrentTab] = useState<string>(
    // set the default tab to created when creator has creations
    createdCount > 0 ? CollectionTab.Created : CollectionTab.Collected
  );

  const collectionTabs: TabVisibility[] = [
    {
      label: (
        <ProfileCollectionTabLabel
          label={CollectionTab.Created}
          count={createdCount}
          showCount={!isCountsLoading}
        />
      ),
      value: CollectionTab.Created,
      isVisible: createdCount > 0,
    },
    {
      label: (
        <ProfileCollectionTabLabel
          label={CollectionTab.Collected}
          count={collectedCount}
          showCount={!isCountsLoading}
        />
      ),
      value: CollectionTab.Collected,
      isVisible: collectedCount > 0,
    },
    {
      label: (
        <ProfileCollectionTabLabel
          label={CollectionTab.Splits}
          count={splitsCount}
          showCount={!isCountsLoading}
        />
      ),
      value: CollectionTab.Splits,
      isVisible: splitsCount > 0,
    },
    {
      label: (
        <ProfileCollectionTabLabel
          label={CollectionTab.Hidden}
          count={0}
          isActive={currentTab === CollectionTab.Hidden}
          showCount={false}
        />
      ),
      value: CollectionTab.Hidden,
      className: lastTabStyles,
      isVisible: hiddenCount > 0 && isCurrentUserProfile,
    },
  ];

  const visibleTabs = filter(
    (tab: TabVisibility) => Boolean(tab.isVisible),
    collectionTabs
  );

  const currentTabItem = find(
    (tab: TabVisibility) => tab.value === currentTab,
    collectionTabs
  );

  const currentTabIsHidden = currentTabItem?.isVisible === false;

  const firstTabValue = path<string>([0, 'value'], visibleTabs);

  const isEmptyCollection = isEmptyOrNil(visibleTabs);

  useEffect(() => {
    setCurrentTab(firstTabValue);
  }, [firstTabValue, publicKey, currentTabIsHidden]);

  const sharedPaneProps = {
    variables: { publicKey, indexedStates },
    isCurrentUserProfile,
    currentUser,
    currentUserIsLoading,
    publicKey,
  };

  if (isUserMigrated) {
    return <ProfileMigrated migratedAddress={user?.migratedToUser} />;
  }

  if (isEmptyCollection) {
    return null;
  }

  return (
    <>
      {isCountsLoading ? (
        <ProfileCollectionTabSkeleton />
      ) : (
        <TabsWithLabels<TabVisibility, string>
          currentView={currentTab}
          setCurrentView={setCurrentTab}
          tabs={visibleTabs}
        />
      )}

      {cond<string, JSX.Element>([
        [
          equals(CollectionTab.Created),
          always(
            <ProfileCollectionPane<UserArtworksCreatedVariables>
              {...sharedPaneProps}
              collectionQueryHook={useUserArtworksCreated}
            />
          ),
        ],
        [
          equals(CollectionTab.Collected),
          always(
            <ProfileCollectionPane<UserArtworksCollectedVariables>
              {...sharedPaneProps}
              collectionQueryHook={useUserArtworksCollected}
            />
          ),
        ],
        [
          equals(CollectionTab.Splits),
          always(
            <ProfileCollectionPane<UserArtworksSplitsVariables>
              {...sharedPaneProps}
              collectionQueryHook={useUserArtworksSplits}
            />
          ),
        ],
        [
          equals(CollectionTab.Hidden),
          always(
            <ProfileCollectionPane<UserArtworksHiddenVariables>
              {...sharedPaneProps}
              collectionQueryHook={useUserArtworksHidden}
            />
          ),
        ],
      ])(currentTab)}
    </>
  );
}

function ProfileCollectionTabSkeleton(): JSX.Element {
  return (
    <Flex
      css={{
        height: 42,
        marginBottom: '$4',
        borderBottom: 'solid 1px $black10',
      }}
    >
      <GraySquare css={{ marginRight: '$6', height: 22, width: 96 }} />
      <GraySquare css={{ height: 22, width: 96 }} />
    </Flex>
  );
}

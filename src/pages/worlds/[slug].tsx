/* eslint-disable max-lines */
/** @jsxRuntime classic */
/* @jsx jsx */
import React, { useState } from 'react';
import { jsx } from 'theme-ui';
import { GetStaticPropsResult } from 'next';

import PreviewMode from 'components/PreviewMode';
import Page from 'components/Page';
import Body from 'components/Body';
import Tabs from 'components/tabs/Tabs';
import CategoryFeaturedNftArtwork from 'components/worlds/WorldFeaturedNftArtwork';
import FeaturedWorldCreators from 'components/worlds/FeaturedWorldCreators';
import FeaturedSectionHeading from 'components/FeaturedSectionHeading';
import FeaturedWorlds from 'components/worlds/FeaturedWorlds';

import { getTokenId } from 'utils/products';

import { getWorldsOrder, getWorld } from 'queries/server/content';
import { getHasuraArtworkByTokenId } from 'queries/hasura/artworks';
import {
  getArtworksByTokenIds,
  getGraphAndServerArtworkByPublicKeys,
} from 'queries/artworks';
import {
  getHasuraUserByUsername,
  getHasuraUsers,
  getHasuraUsersByUsernames,
} from 'queries/hasura/users';
import useAuthToken from 'hooks/queries/use-auth-token';

import Artwork from 'types/Artwork';
import { World, WorldCardSimple } from 'types/World';
import { PageColorMode } from 'types/page';
import Account from 'types/Account';
import { VideoAssetQuality } from 'types/Assets';

import { notEmptyOrNil, rejectNils } from 'utils/helpers';
import { sortCreatorsByUsernames } from 'utils/creator';
import { maybeGetAddress } from 'utils/users';
import { buildArtworkAssetUrl, buildPosterUrl } from 'utils/assets';
import { positionRelative } from 'types/styles';
import getChainId from 'lib/chainId';
import FeaturedCreatorsArtworks from 'components/worlds/FeaturedCreatorsArtworks';
import { compose, flatten, isNil, map, path, reject, uniq } from 'ramda';
import Bid from 'types/Bid';
import { isAuctionOpenForBids } from 'utils/auctions/auctions';

interface WorldPageProps {
  preview: boolean;
  featuredArtwork: Artwork;
  world: World;
  creators: Account[];
  artworks: Artwork[];
  bidders: Account[];
  worlds: WorldCardSimple[];
  ogImage?: string;
  curatedBy?: Account;
}

enum Tab {
  Creators = 'Creators',
  ArtworkFeed = 'Artwork feed',
}

const tabs = [Tab.Creators, Tab.ArtworkFeed];

export default function WorldPage(props: WorldPageProps): JSX.Element {
  const {
    preview,
    featuredArtwork,
    world,
    creators,
    artworks,
    bidders,
    worlds,
    ogImage,
    curatedBy,
  } = props;

  const { user } = useAuthToken();
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Creators);

  const creatorIds = creators?.map((creator) =>
    maybeGetAddress(creator.publicKey)
  );

  const hasArtworks = artworks.length > 0;

  const availableTabs = hasArtworks ? tabs : [Tab.Creators];

  const ogImageUrl = ogImage ? `https:${ogImage}` : null;

  return (
    <Page
      title={world.title}
      headerMode={PageColorMode.dark}
      image={ogImageUrl}
      absolute
    >
      {preview && <PreviewMode />}
      <CategoryFeaturedNftArtwork
        title={world.title}
        featuredArtwork={featuredArtwork}
        curatedBy={curatedBy}
      />
      <Body sx={{ mb: 'xl', position: positionRelative, zIndex: 4 }}>
        <Tabs
          tabs={availableTabs}
          currentView={currentTab}
          setCurrentView={(tab) => setCurrentTab(tab)}
        />
        {currentTab === Tab.Creators && (
          <FeaturedWorldCreators
            publicAddress={user?.publicAddress}
            world={world.slug}
            creatorIds={creatorIds}
          />
        )}

        {currentTab === Tab.ArtworkFeed && (
          <FeaturedCreatorsArtworks artworks={artworks} users={bidders} />
        )}

        <FeaturedSectionHeading linkHref="/worlds" linkText="View all worlds">
          More Worlds
        </FeaturedSectionHeading>
        <FeaturedWorlds featuredWorlds={worlds} />
      </Body>
    </Page>
  );
}

export async function getStaticPaths() {
  const chainId = getChainId();

  // Get order of the worlds
  const categories = await getWorldsOrder({ chainId });

  // Filter down order to 10 only
  const firstTenCategories = categories.slice(0, 10);

  // Generate first 10 pages statically ahead of time
  const pageParams = firstTenCategories.map((c) => ({
    params: { slug: c.fields.slug },
  }));

  return {
    paths: pageParams,
    fallback: 'blocking',
  };
}

interface getStaticPropsArgs {
  preview: boolean;
  params: { slug: string };
}

export async function getStaticProps({
  preview = false,
  params,
}: getStaticPropsArgs): Promise<GetStaticPropsResult<WorldPageProps>> {
  const { slug } = params;
  const chainId = getChainId();

  // Get the specific world from the slug
  const world = await getWorld({ preview, slug, chainId });

  // If no world is found send 404 page
  if (!world) {
    return { notFound: true };
  }

  // Get the featured NFT Token ID for the world
  const featuredNFTId = getTokenId(world?.fields?.featuredNft);

  // Using the token ID get the featured artwork data
  const featuredArtwork = await getHasuraArtworkByTokenId({
    tokenId: featuredNFTId,
  });

  // Get the featured creators usernames
  const featuredCreatorsUsernames = world?.fields?.featuredCreators
    .map((value) =>
      value
        .substring(value.lastIndexOf('/') + 1)
        .trim()
        .replace(/^@/, '')
    )
    .filter((value) => notEmptyOrNil(value));

  // Get the curated by users username
  const curatedByUsername = world?.fields?.curatedBy
    ?.substring(world?.fields?.curatedBy?.lastIndexOf('/') + 1)
    .trim()
    .replace(/^@/, '');

  const curatedByQuery =
    curatedByUsername && (await getHasuraUserByUsername(curatedByUsername));

  // Get all unique usernames data from the usernames
  const featuredCreatorsQuery = await getHasuraUsersByUsernames(
    rejectNils(featuredCreatorsUsernames)
  );

  // Get all the worlds order
  const worlds = await getWorldsOrder({ preview, chainId });

  // Get first four worlds
  const firstFourWorlds = worlds
    .filter((c) => c.sys.id !== world.sys.id)
    .slice(0, 4);

  const curatorCreatorsUsernames = firstFourWorlds
    .map((value) =>
      value?.fields?.curatedBy
        ?.substring(value?.fields?.curatedBy?.lastIndexOf('/') + 1)
        .trim()
        .replace(/^@/, '')
    )
    .filter((value) => notEmptyOrNil(value));

  const curatorCreatorsQuery = await getHasuraUsersByUsernames(
    curatorCreatorsUsernames
  );

  // Get featured NFT IDs for each of the worlds above
  const featuredCategoryNFTIds = firstFourWorlds.map((c) =>
    getTokenId(c.fields.featuredNft)
  );

  // Get the data for the worlds artworks, this is used in the cards
  const featuredWorldsArtworks = await getArtworksByTokenIds({
    tokenIds: featuredCategoryNFTIds,
    excludeHidden: true,
  });

  // Merge the featured artwork data with the rest of the asset data
  const worldsData = firstFourWorlds.map((w) => {
    const featuredNftAssetId = getTokenId(w.fields.featuredNft);
    const featuredNftAsset = featuredWorldsArtworks.find(
      (a) => a.tokenId === featuredNftAssetId
    );

    if (featuredNftAsset) {
      const assetUrl = buildArtworkAssetUrl(
        { h: 640, q: 80, quality: VideoAssetQuality.Preview },
        featuredNftAsset
      );
      const posterUrl = buildPosterUrl(featuredNftAsset);

      const curatedByUsername = w?.fields?.curatedBy
        ?.substring(w?.fields?.curatedBy?.lastIndexOf('/') + 1)
        .trim()
        .toLowerCase()
        .replace(/^@/, '');

      return {
        title: w.fields.title,
        slug: w.fields.slug,
        assetUrl: assetUrl,
        posterUrl: posterUrl,
        curatedBy:
          curatorCreatorsQuery.users.find(
            (u) => u.username.toLowerCase() === curatedByUsername
          ) ?? null,
      };
    }

    return null;
  });

  // Get featured creators publicKeys
  const creatorsPublicKeys = featuredCreatorsQuery.users.map(
    (u) => u.publicKey
  );

  // Fetch artworks from creators
  const creatorArtworks = await getGraphAndServerArtworkByPublicKeys({
    publicKeys: creatorsPublicKeys,
  });

  // Get artworks of each creator where the auction is live or listed
  const chosenArtworks = creatorArtworks
    ?.filter((artwork) => {
      const isAuctionOpen = isAuctionOpenForBids(
        artwork.mostRecentActiveAuction
      );

      return isAuctionOpen;
    })
    .sort((a, b) => {
      const aInAuction = Boolean(a.mostRecentActiveAuction.highestBid);
      const bInAuction = Boolean(b.mostRecentActiveAuction.highestBid);
      if (aInAuction || bInAuction) {
        return Number(bInAuction) - Number(aInAuction);
      }
      if (!aInAuction && !bInAuction) {
        const aListed = a.mostRecentActiveAuction.dateCreated;
        const bListed = b.mostRecentActiveAuction.dateCreated;
        return Number(bListed) - Number(aListed);
      }
    });

  // Get bidders of any in progress auctions on featured artworks public keys
  const biddersPublicKeys = compose<
    Artwork[],
    Bid[][],
    Bid[][],
    Bid[],
    string[],
    string[]
  >(
    uniq,
    map(path(['bidder', 'id'])),
    flatten,
    reject(isNil),
    map((e: Artwork) => e.mostRecentActiveAuction?.bids)
  )(chosenArtworks);

  // Get the users data of the above bidders
  const biddersUsersData = await getHasuraUsers({
    publicKeys: biddersPublicKeys,
  });

  const ogImageUrl = world.fields.openGraphImage?.fields?.file?.url ?? null;

  return {
    props: {
      preview,
      featuredArtwork: featuredArtwork ?? null,
      world: world.fields,
      creators: sortCreatorsByUsernames(
        featuredCreatorsUsernames,
        featuredCreatorsQuery.users
      ),
      artworks: chosenArtworks,
      bidders: biddersUsersData.users,
      worlds: rejectNils(worldsData),
      ogImage: ogImageUrl,
      curatedBy: curatedByQuery?.user ?? null,
    },
    revalidate: 60,
  };
}

import { mergeDeepLeft, compose, prop, dissoc, assocPath } from 'ramda';
import Account from 'types/Account';
import Artwork from 'types/Artwork';

import { maybeLowerCase } from 'utils/case';
import { notEmptyOrNil } from './helpers';

export const formatProduct = (product) => ({
  ...product,
  startingPrice: product?.startPrice,
  totalBuyPrice: product?.startPrice,
  availableTokens: product?.totalSupply,
  images: product?.imageUrls,
  videos: product?.videoUrls,
});

export function mergeNfts({ serverProducts, chainProducts }) {
  return chainProducts.map((chainProduct) => ({
    ...serverProducts.find((p) => p.tokenId === chainProduct.tokenId),
    ...chainProduct,
  }));
}

export function mergeNftActivity({ actions, products }) {
  return actions.map((action) => {
    const product = products.find((p) => {
      return maybeLowerCase(p.tokenId) === maybeLowerCase(action.nft.tokenId);
    });
    // here we want to return the nested nft bids vs. the top level
    const nftBids = action?.nft?.nftBids ?? [];
    const acceptedBids = action?.nft?.acceptedBids ?? [];

    return {
      ...product,
      ...action,
      acceptedBids,
      nftBids,
    };
  });
}

// TODO: fix the any type
const getCreator = compose<any, Account, Account>(
  dissoc('account'),
  prop('creator')
);

export function mergeArtwork(
  graphArtwork: Artwork,
  serverArtwork: Artwork
): Artwork {
  const mergedArtwork = mergeDeepLeft<Artwork, Artwork>(
    graphArtwork,
    serverArtwork
  );
  const mergedCreator = getCreator(mergedArtwork);

  // TODO: fix the <any, any> types
  const mergedArtworkAndCreator = assocPath<any, any>(
    ['creator', 'account'],
    mergedCreator,
    mergedArtwork
  );

  return mergedArtworkAndCreator;
}

const findMatchingArtwork = (artwork: Artwork, artworks: Artwork[]) => {
  return artworks.find((artworkToFind) => {
    return Number(artworkToFind.tokenId) === Number(artwork.tokenId);
  });
};

interface MergeArtworksArgs {
  serverArtworks: Artwork[];
  graphArtworks: Artwork[];
}

export const mergeServerArtworks = ({
  serverArtworks,
  graphArtworks,
}: MergeArtworksArgs): Artwork[] => {
  const products = serverArtworks.map((serverArtwork) => {
    const foundGraphArtwork = findMatchingArtwork(serverArtwork, graphArtworks);
    if (foundGraphArtwork) {
      return mergeArtwork(foundGraphArtwork, serverArtwork);
    }
    return serverArtwork;
  });
  return products;
};

// wrap mergeServerArtworks and reject products that aren’t deployed
export const mergeGraphArtworks = ({
  serverArtworks,
  graphArtworks,
}: MergeArtworksArgs): Artwork[] => {
  const products = graphArtworks.map((graphArtwork) => {
    const foundServerArtwork = findMatchingArtwork(
      graphArtwork,
      serverArtworks
    );
    if (foundServerArtwork) {
      return mergeArtwork(graphArtwork, foundServerArtwork);
    }
    return graphArtwork;
  });
  return products;
};

// wrap mergeServerArtworks and reject products that aren’t deployed
// and reject products that aren't in the db
export const mergeGraphArtworksIfInDB = ({
  serverArtworks,
  graphArtworks,
}: MergeArtworksArgs): Artwork[] => {
  const products = graphArtworks.map((graphArtwork) => {
    const foundServerArtwork = findMatchingArtwork(
      graphArtwork,
      serverArtworks
    );
    if (foundServerArtwork) {
      return mergeArtwork(graphArtwork, foundServerArtwork);
    }
    return null;
  });
  return products.filter(notEmptyOrNil);
};

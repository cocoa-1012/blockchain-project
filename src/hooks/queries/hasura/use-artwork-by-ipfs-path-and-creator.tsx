import { useQuery, QueryResult, QueryHookOptions } from '@apollo/client';

import Artwork from 'types/Artwork';

import { GET_HASURA_ARTWORKS_BY_IPFS_PATH } from 'queries/hasura/artworks';

import { maybeGetAddress } from 'utils/users';

interface ArtworksByIPFSData {
  artworks: Artwork[];
}
interface ArtworksByIPFSPathArgs extends QueryHookOptions {
  assetIPFSPath: string;
  publicKey: string;
}

export default function useArtworksByIPFSPathAndCreator({
  assetIPFSPath,
  publicKey,
  pollInterval,
  skip,
}: ArtworksByIPFSPathArgs): QueryResult<
  ArtworksByIPFSData,
  ArtworksByIPFSPathArgs
> {
  return useQuery<ArtworksByIPFSData, ArtworksByIPFSPathArgs>(
    GET_HASURA_ARTWORKS_BY_IPFS_PATH,
    {
      variables: { assetIPFSPath, publicKey: maybeGetAddress(publicKey) },
      skip: !assetIPFSPath || skip,
      context: { endpoint: 'hasura' },
      pollInterval,
    }
  );
}

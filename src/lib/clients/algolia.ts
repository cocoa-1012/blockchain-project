import algoliasearch from 'algoliasearch/lite';
import { AlgoliaIndexName, AlgoliaArtworkAvailability } from 'types/Algolia';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);

export default searchClient;

export const algoliaArtworksIndexes: AlgoliaIndexName[] = [
  {
    label: 'Date Listed: Newest',
    value: 'artworks_sort_date_listed_desc',
    enabledModes: [AlgoliaArtworkAvailability.RESERVE_NOT_MET],
  },
  {
    label: 'Date Listed: Oldest',
    value: 'artworks_sort_date_listed_asc',
    enabledModes: [AlgoliaArtworkAvailability.RESERVE_NOT_MET],
  },
  {
    label: 'Ending: Soonest',
    value: 'artworks_sort_date_sold_asc',
    enabledModes: [AlgoliaArtworkAvailability.LIVE_AUCTION],
  },
  {
    label: 'Ending: Latest',
    value: 'artworks_sort_date_sold_desc',
    enabledModes: [AlgoliaArtworkAvailability.LIVE_AUCTION],
  },
  {
    label: 'Date Sold: Newest',
    value: 'artworks_sort_date_sold_desc',
    enabledModes: [AlgoliaArtworkAvailability.SOLD],
  },
  {
    label: 'Date Sold: Oldest',
    value: 'artworks_sort_date_sold_asc',
    enabledModes: [AlgoliaArtworkAvailability.SOLD],
  },
  {
    label: 'Price: Highest',
    value: 'artworks_sort_price_desc',
    enabledModes: [
      AlgoliaArtworkAvailability.RESERVE_NOT_MET,
      AlgoliaArtworkAvailability.LIVE_AUCTION,
      AlgoliaArtworkAvailability.SOLD,
    ],
  },
  {
    label: 'Price: Lowest',
    value: 'artworks_sort_price_asc',
    enabledModes: [
      AlgoliaArtworkAvailability.RESERVE_NOT_MET,
      AlgoliaArtworkAvailability.LIVE_AUCTION,
      AlgoliaArtworkAvailability.SOLD,
    ],
  },
];

export const algoliaUsersIndexes: AlgoliaIndexName[] = [
  {
    label: 'Total Volume',
    value: 'users_sort_total_vol_desc',
    enabledModes: [],
  },
  {
    label: 'Newest to Oldest',
    value: 'users_sort_date_joined_desc',
    enabledModes: [],
  },
  {
    label: 'Oldest to Newest',
    value: 'users_sort_date_joined_asc',
    enabledModes: [],
  },
  {
    label: 'Most Minted',
    value: 'users_sort_num_minted_desc',
    enabledModes: [],
  },
  { label: 'Most Sold', value: 'users_sort_num_sold_desc', enabledModes: [] },
];

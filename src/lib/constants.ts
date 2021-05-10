import ModerationStatus from 'types/ModerationStatus';

export const EXAMPLE_PATH = 'cms-contentful';
export const CMS_NAME = 'Contentful';
export const CMS_URL = 'https://www.contentful.com';
export const HOME_OG_IMAGE_URL =
  'https://og-image.now.sh/Next.js%20Blog%20Example%20with%20**Contentful**.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg&images=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOSIgaGVpZ2h0PSIzMiI%2BCiAgPHBhdGggZmlsbD0iI0ZGRDg1RiIgZD0iTTkuNyAyMi4zQzggMjAuNyA3IDE4LjUgNyAxNnMxLTQuNyAyLjYtNi4zYzEuNC0xLjQgMS40LTMuNiAwLTVzLTMuNi0xLjQtNSAwQzEuOCA3LjYgMCAxMS42IDAgMTZzMS44IDguNCA0LjcgMTEuM2MxLjQgMS40IDMuNiAxLjQgNSAwIDEuMy0xLjQgMS4zLTMuNiAwLTV6Ij48L3BhdGg%2BCiAgPHBhdGggZmlsbD0iIzNCQjRFNyIgZD0iTTkuNyA5LjdDMTEuMyA4IDEzLjUgNyAxNiA3czQuNyAxIDYuMyAyLjZjMS40IDEuNCAzLjYgMS40IDUgMHMxLjQtMy42IDAtNUMyNC40IDEuOCAyMC40IDAgMTYgMFM3LjYgMS44IDQuNyA0LjdjLTEuNCAxLjQtMS40IDMuNiAwIDUgMS40IDEuMyAzLjYgMS4zIDUgMHoiPjwvcGF0aD4KICA8cGF0aCBmaWxsPSIjRUQ1QzY4IiBkPSJNMjIuMyAyMi4zQzIwLjcgMjQgMTguNSAyNSAxNiAyNXMtNC43LTEtNi4zLTIuNmMtMS40LTEuNC0zLjYtMS40LTUgMHMtMS40IDMuNiAwIDVDNy42IDMwLjIgMTEuNiAzMiAxNiAzMnM4LjQtMS44IDExLjMtNC43YzEuNC0xLjQgMS40LTMuNiAwLTUtMS40LTEuMy0zLjYtMS4zLTUgMHoiPjwvcGF0aD4KICA8Y2lyY2xlIGN4PSI3LjIiIGN5PSI3LjIiIHI9IjMuNSIgZmlsbD0iIzMwOEJDNSI%2BPC9jaXJjbGU%2BCiAgPGNpcmNsZSBjeD0iNy4yIiBjeT0iMjQuOCIgcj0iMy41IiBmaWxsPSIjRDU0NjVGIj48L2NpcmNsZT4KPC9zdmc%2B';

export const UPVOTE_OG_IMAGE_URL =
  'https://foundation.app/images/community-upvote.jpg';

export const PINATA_FILE_ENDPOINT =
  'https://api.pinata.cloud/pinning/pinFileToIPFS';
export const PINATA_JSON_ENDPOINT =
  'https://api.pinata.cloud/pinning/pinJSONToIPFS';

// TODO: Delete this when we stop using it
export const ONE_ETH_IN_WEI = '1000000000000000000';

export const POLL_INTERVAL_TOKEN_ID = 1000 * 2; // 2 seconds
export const POLL_INTERVAL_VIDEO = 1000 * 2; // 2 seconds

export const UNLOCKABLE_CONTENT_MAX_CHARS = 1000;
export const TWITTER_URL_MAX_CHARS = 400; // TODO: Pick value

export const HOMEPAGE_FEATURED_ARTWORK_ID = '21';

export const HOMEPAGE_FEATURED_ARTWORK_IDS = [
  '4679',
  '4616',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
];

export const HOMEPAGE_FEATURED_CREATOR_IDS = [
  'http://localhost:3000/loudsqueak',
  'http://localhost:3000/sdgjasldkgjasldg',
  'http://localhost:3000/loudsqueak-demo',
  'http://localhost:3000/lozza',
  'http://localhost:3000/turnipboi',
  'http://localhost:3000/elpizoch',
  'http://localhost:3000/elpizo',
  'http://localhost:3000/gosset2',
  'http://localhost:3000/matt',
  'http://localhost:3000/hardly',
  'http://localhost:3000/paul',
  'http://localhost:3000/maalavidaa',
  'http://localhost:3000/jkm',
  'http://localhost:3000/ecmagic',
  'http://localhost:3000/paulcowgill',
  'http://localhost:3000/gonzzzalo',
  'http://localhost:3000/elpizo_',
  'http://localhost:3000/dappb0i',
  'http://localhost:3000/signe',
  'http://localhost:3000/grantspanier',
  'http://localhost:3000/glitchtextiles',
  'http://localhost:3000/tomgalle',
  'http://localhost:3000/addie',
  'http://localhost:3000/mollysoda',
  'http://localhost:3000/postdigital',
  'http://localhost:3000/plsandty',
  'http://localhost:3000/zollo',
  'http://localhost:3000/neuegoods',
  'http://localhost:3000/samanthays',
  'http://localhost:3000/gonzzzalo_',
  'http://localhost:3000/loudsqueak_',
  'http://localhost:3000/davidportebeckefeld_',
  'http://localhost:3000/arvidabystromold',
  'http://localhost:3000/pixlpa',
  'http://localhost:3000/dappboi',
  'http://localhost:3000/notsamantha',
  'http://localhost:3000/sam',
  'http://localhost:3000/Lindsay',
  'http://localhost:3000/arvidabystrom',
  'http://localhost:3000/davidportebeckefeld',
  'http://localhost:3000/Nick',
  'http://localhost:3000/kayvon',
  'http://localhost:3000/jessewldn',
  'http://localhost:3000/NULL',
  'http://localhost:3000/samantha',
  'http://localhost:3000/adgasdg',
  'http://localhost:3000/hd-test',
  'http://localhost:3000/davidpb_art',
  'http://localhost:3000/robbie',
  'http://localhost:3000/coopahtroopa',
];

const MOCK_CATEGORY_1 = {
  sys: { type: 'Entry', locale: 'en-US' },
  fields: {
    title: 'Contemporary Art',
    slug: 'contemporary-art',
    featuredNft: 'http://localhost:3000/nft/nft-4855',
    curatedBy: 'https://foundation.app/JIMMY',
    featuredCreators: [
      'https://foundation.app/JIMMY',
      'https://foundation.app/jacquesgreene',
      'https://foundation.app/flumezawada',
    ],
  },
};

export const SINGLE_CATEGORY_QUERY = {
  items: [MOCK_CATEGORY_1],
};

export const CATEGORIES_LIST_QUERY = {
  items: [
    {
      sys: { type: 'Entry', locale: 'en-US' },
      fields: { order: [MOCK_CATEGORY_1] },
    },
  ],
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const PUBLIC_FEED_PER_PAGE_COUNT = 48;

export const CATEGORY_PER_PAGE_COUNT = 100;

export const DEFAULT_PROVIDER_TYPE = 'METAMASK';

export const ALL_USER_MODERATION_STATUSES = [
  ModerationStatus.Active,
  ModerationStatus.Suspended,
  ModerationStatus.UnderReview,
];

export const ALL_ARTWORK_MODERATION_STATUSES = [
  ...ALL_USER_MODERATION_STATUSES,
  ModerationStatus.TakedownRequested,
];

export const DUPLICATE_ASSET_ERROR_MSG = 'DUPLICATE_ASSET';

export const MIN_FOLLOWS_COUNT = 5;

// the foundation 15%  fee multiplier
export const FND_FEE_MULTIPLIER = 0.15;

// the creator’s 85%
export const CREATOR_FEE_MULTIPLIER = 1 - FND_FEE_MULTIPLIER;

export const SOLD_FOR_LABEL = 'Sold for';

export const WALLETCONNECT_BRIDGE =
  'https://foundation.bridge.walletconnect.org';

export const SENTRY_IGNORED_ERRORS = [
  'MetaMask Personal Message Signature: User denied message signature.',
  'MetaMask Tx Signature: User denied transaction signature.',
  'MetaMask Message Signature: User denied message signature.',
  'User rejected request',
  'User rejected the transaction',
];

export const CONTENTFUL_HOME_PAGE_ID = '4aQQfoWs4jjk4srqvD1eyJ';
export const CONTENTFUL_CATEGORY_PAGE_ID = '5W3I4Edx3cRWf1joY7lxfP';

export const FORM_URL =
  'https://withfoundation.us19.list-manage.com/subscribe/post-json?u=c4a22288e5ecbe301dff16398&amp;id=4b6e100ee2';

export const MAX_SPLIT_RECIPIENT_COUNT = 4;

export const LEVER_API_URL =
  'https://api.lever.co/v0/postings/with-foundation?mode=json';

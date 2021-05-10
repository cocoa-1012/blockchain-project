// Note: Can't destructure these env vars
// https://github.com/vercel/next.js/pull/6889/files

import { getStrAfterLastSlash } from 'utils/products';

if (!process.env.NEXT_PUBLIC_RPC_URI) {
  console.warn('NEXT_PUBLIC_RPC_URI is a required env var');
}

export default function getAlchemyAPIKey() {
  return getStrAfterLastSlash(process.env.NEXT_PUBLIC_RPC_URI);
}

// Note: Can't destructure these env vars
// https://github.com/vercel/next.js/pull/6889/files

if (!process.env.NEXT_PUBLIC_CHAIN_ID) {
  console.warn('NEXT_PUBLIC_CHAIN_ID is a required env var');
}

export default function getChainId(): number {
  return Number(process.env.NEXT_PUBLIC_CHAIN_ID);
}

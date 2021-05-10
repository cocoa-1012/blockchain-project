import fetch from 'isomorphic-unfetch';

const BASE_URL = 'https://api.coingecko.com/api/v3';

interface PriceData {
  ethereum: {
    usd: number;
  };
}

export async function fetchPrice(
  path: string,
  overrides: RequestInit
): Promise<PriceData> {
  const params = Object.assign(
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    overrides
  );
  const request = await fetch(`${BASE_URL}/${path}`, params);
  return await request.json();
}

import { useQuery } from 'react-query';

import { QueryCacheKey } from 'types/Queries';

import { fetchPrice } from 'lib/clients/price';

interface ETHPrice {
  price: number;
  isLoading: boolean;
}

export default function useETHPrice(): ETHPrice {
  const { data, isLoading } = useQuery(
    [QueryCacheKey.ETHPrice],
    () => fetchPrice('simple/price?vs_currencies=usd&ids=ethereum', null),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // 1hr in ms
      staleTime: 60 * 60 * 1000,
    }
  );

  return { isLoading, price: data?.ethereum?.usd };
}

import { useQuery, UseQueryResult } from 'react-query';
import { ClientError } from 'graphql-request';

import useReadOnlyProvider from 'hooks/web3/use-read-only-provider';
import useAuthToken from './use-auth-token';

import { fromBNDec } from 'utils/numbers';
import { isAllTrue } from 'utils/helpers';

import { QueryCacheKey } from 'types/Queries';

export default function useBalance(): UseQueryResult<number, ClientError> {
  const { user } = useAuthToken();
  const { provider, isLoading: isProviderLoading } = useReadOnlyProvider();

  const publicAddress = user?.publicAddress;

  const isReady = isAllTrue([!isProviderLoading, publicAddress, provider]);

  return useQuery(
    [QueryCacheKey.Balance, publicAddress],
    async () => {
      const balanceData = await provider.getBalance(publicAddress);
      return fromBNDec(balanceData);
    },
    { enabled: isReady, staleTime: 1000 * 60 * 10, refetchOnMount: false }
  );
}

import { useEffect } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { QueryCacheKey } from 'types/Queries';
import WalletUser from 'types/WalletUser';

interface UserData {
  user: WalletUser;
}
interface UseUserResponse extends UserData {
  isLoading: boolean;
  isError: boolean;
}

// useAuthToken only provides the token for server mutations
// Other data should come from the provider or a server or subgraph query for the user
// to ensure the latest data is present

export default function useAuthToken(): UseUserResponse {
  const { data, isError, isLoading } = useQuery<UserData, Error>(
    QueryCacheKey.WalletUser,
    fetchUser,
    {
      refetchInterval: false,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isError) {
      queryClient.invalidateQueries(QueryCacheKey.WalletUser);
    }
  }, [isError, queryClient]);

  if (isError) {
    return {
      user: null,
      isLoading: false,
      isError: true,
    };
  }

  return {
    user: data?.user,
    isLoading,
    isError: false,
  };
}

async function fetchUser() {
  const res = await fetch('/api/user');

  if (res.status === 400) {
    throw new Error('400 error');
  }
  if (res.ok) {
    return await res.json();
  }
  throw new Error(`fetchUser ${res.status}`);
}

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import WalletUser from 'types/WalletUser';

export default function useRedirectToProfile(user: WalletUser): null {
  const router = useRouter();

  const usernameOrPublicKey = user?.username ?? user?.publicAddress;

  useEffect(() => {
    if (usernameOrPublicKey) {
      router.push(`/${usernameOrPublicKey}`);
    }
  }, [usernameOrPublicKey]);

  return null;
}

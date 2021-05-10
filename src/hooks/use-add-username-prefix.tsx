import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { isAddress } from '@ethersproject/address';

import { getFirstValue } from 'utils/helpers';

export default function useAddUsernamePrefix(): void {
  const router = useRouter();

  useEffect(() => {
    const hasNoAtSymbol = new RegExp(/^[^@]/);
    const username = getFirstValue(router.query.username);
    const isEthAddress = isAddress(username);

    if (hasNoAtSymbol.test(username) && !isEthAddress && router.isReady) {
      const newPath = router.asPath.replace('/', '/@');
      router.push(newPath, null, { shallow: true });
    }
  }, [router]);
}

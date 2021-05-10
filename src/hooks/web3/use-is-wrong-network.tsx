import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import getChainId from 'lib/chainId';

interface UseIsWrongNetwork {
  isWrongNetwork: boolean;
  isLoading: boolean;
}

export default function useIsWrongNetwork(): UseIsWrongNetwork {
  const { active, chainId } = useWeb3React();
  const [isWrongNetwork, setIsWrongNetwork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkChainId = async () => {
      if (!active) {
        return;
      }

      // TODO: Decide if we want to skip wrong network logic on user loading too
      const correctChainId = getChainId();
      const isCorrectChain = correctChainId === chainId;

      setIsWrongNetwork(!isCorrectChain);
      setIsLoading(false);
    };

    checkChainId();
  }, [active, chainId]);

  return { isWrongNetwork, isLoading };
}

import { useCallback, useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

interface CopyText {
  handleCopy: () => void;
  hasCopied: boolean;
}

export default function useCopyText(textToCopy: string): CopyText {
  const [, copyToClipboard] = useCopyToClipboard();
  const [noticationKey, setNotificationKey] = useState<number>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const handleCopy = useCallback(() => {
    setHasCopied(true);
    setNotificationKey(Date.now());
    copyToClipboard(textToCopy);
  }, [setHasCopied, textToCopy, setNotificationKey, copyToClipboard]);

  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  }, [noticationKey]);

  return { handleCopy, hasCopied };
}

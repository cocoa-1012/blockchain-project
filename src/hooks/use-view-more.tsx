import { Dispatch, SetStateAction, useState } from 'react';

interface useViewMore {
  hasPreview: boolean;
  previewText: string;
  remainingText: string;
  isViewingMore: boolean;
  setIsViewingMore: Dispatch<SetStateAction<boolean>>;
}

export default function useViewMore(
  inputText = '',
  maxPreviewWords = 20
): useViewMore {
  const [isViewingMore, setIsViewingMore] = useState<boolean>(false);
  const wordsArray = inputText.split(' ');
  const numberOfWords = wordsArray.length;
  const hasPreview = numberOfWords > maxPreviewWords;
  const previewText = wordsArray.slice(0, maxPreviewWords).join(' ');

  const remainingText = wordsArray
    .slice(maxPreviewWords, numberOfWords)
    .join(' ');

  return {
    hasPreview,
    previewText,
    remainingText,
    isViewingMore,
    setIsViewingMore,
  };
}

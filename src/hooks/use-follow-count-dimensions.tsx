import { useMeasure } from 'react-use';
import { UseMeasureRef } from 'react-use/lib/useMeasure';

import { cond, equals, always, T, gt } from 'ramda';

import { CardDimension } from 'types/Card';

const getCardWidth = cond<number, CardDimension>([
  // when the element query width is 0 we assume it’s loading
  [equals(0), always(CardDimension.loading)],
  // when the width is greater than 280, return the large size
  [(width) => gt(width, 280), always(CardDimension.large)],
  // otherwise return the small size
  [T, always(CardDimension.small)],
]);

interface FollowCountDimensions {
  size: CardDimension;
}

// hook component that returns an element ref which
// and gives an equivalent of an element media query
export default function useFollowCountDimensions(): [
  UseMeasureRef<HTMLDivElement>,
  FollowCountDimensions
] {
  const [measureRef, { width: cardWidth }] = useMeasure<HTMLDivElement>();

  const cardWidthEnum = getCardWidth(cardWidth);

  return [measureRef, { size: cardWidthEnum }];
}

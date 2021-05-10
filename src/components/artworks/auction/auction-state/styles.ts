import { ThemeUIStyleObject } from '@theme-ui/css';

export function getAuctionPriceStyle(isNarrow: boolean): ThemeUIStyleObject {
  return {
    ...(!isNarrow && {
      paddingRight: 'l',
      borderRight: 'solid 1px',
      borderColor: 'black.10',
    }),
  };
}

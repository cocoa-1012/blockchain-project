import { allPass, always, cond, equals, propEq } from 'ramda';

import {
  TimeFilter,
  TrendingCollectorColumn,
  TrendingCreatorColumn,
} from 'types/Trending';

export const getTimeFilterPrefix = cond([
  [equals(TimeFilter.OneDay), always('oneDay')],
  [equals(TimeFilter.SevenDay), always('oneWeek')],
  [equals(TimeFilter.ThirtyDay), always('oneMonth')],
  [equals(TimeFilter.AllTime), always('total')],
]);

export const getTrendingCreatorOrderByField = cond([
  // One Day filters
  [
    allPass([
      propEq('timeFilter', TimeFilter.OneDay),
      propEq('orderByColumn', TrendingCreatorColumn.TotalVolume),
    ]),
    always('oneDayVol'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.OneDay),
      propEq('orderByColumn', TrendingCreatorColumn.NftsSold),
    ]),
    always('oneDayNumSold'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.OneDay),
      propEq('orderByColumn', TrendingCreatorColumn.UniqueCollectors),
    ]),
    always('oneDayCollectors'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.OneDay),
      propEq('orderByColumn', TrendingCreatorColumn.PrimarySales),
    ]),
    always('oneDayPrimaryVol'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.OneDay),
      propEq('orderByColumn', TrendingCreatorColumn.SecondarySales),
    ]),
    always('oneDaySecondaryVol'),
  ],
  // One week
  [
    allPass([
      propEq('timeFilter', TimeFilter.SevenDay),
      propEq('orderByColumn', TrendingCreatorColumn.TotalVolume),
    ]),
    always('oneWeekVol'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.SevenDay),
      propEq('orderByColumn', TrendingCreatorColumn.NftsSold),
    ]),
    always('oneWeekNumSold'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.SevenDay),
      propEq('orderByColumn', TrendingCreatorColumn.UniqueCollectors),
    ]),
    always('oneWeekCollectors'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.SevenDay),
      propEq('orderByColumn', TrendingCreatorColumn.PrimarySales),
    ]),
    always('oneWeekPrimaryVol'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.SevenDay),
      propEq('orderByColumn', TrendingCreatorColumn.SecondarySales),
    ]),
    always('oneWeekSecondaryVol'),
  ],
  // One month
  [
    allPass([
      propEq('timeFilter', TimeFilter.ThirtyDay),
      propEq('orderByColumn', TrendingCreatorColumn.TotalVolume),
    ]),
    always('oneMonthVol'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.ThirtyDay),
      propEq('orderByColumn', TrendingCreatorColumn.NftsSold),
    ]),
    always('oneMonthNumSold'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.ThirtyDay),
      propEq('orderByColumn', TrendingCreatorColumn.UniqueCollectors),
    ]),
    always('oneMonthCollectors'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.ThirtyDay),
      propEq('orderByColumn', TrendingCreatorColumn.PrimarySales),
    ]),
    always('oneMonthPrimaryVol'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.ThirtyDay),
      propEq('orderByColumn', TrendingCreatorColumn.SecondarySales),
    ]),
    always('oneMonthSecondaryVol'),
  ],
  // All time
  [
    allPass([
      propEq('timeFilter', TimeFilter.AllTime),
      propEq('orderByColumn', TrendingCreatorColumn.TotalVolume),
    ]),
    always('totalVol'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.AllTime),
      propEq('orderByColumn', TrendingCreatorColumn.NftsSold),
    ]),
    always('totalNumSold'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.AllTime),
      propEq('orderByColumn', TrendingCreatorColumn.UniqueCollectors),
    ]),
    always('totalCollectors'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.AllTime),
      propEq('orderByColumn', TrendingCreatorColumn.PrimarySales),
    ]),
    always('totalPrimaryVol'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.AllTime),
      propEq('orderByColumn', TrendingCreatorColumn.SecondarySales),
    ]),
    always('totalSecondaryVol'),
  ],
]);

export const getTrendingCollectorOrderByField = cond([
  // One Day filters
  [
    allPass([
      propEq('timeFilter', TimeFilter.OneDay),
      propEq('orderByColumn', TrendingCollectorColumn.CreatorsSupported),
    ]),
    always('oneDayCreatorsSupported'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.OneDay),
      propEq('orderByColumn', TrendingCollectorColumn.NftsBought),
    ]),
    always('oneDayNumBought'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.OneDay),
      propEq('orderByColumn', TrendingCollectorColumn.TotalSpent),
    ]),
    always('oneDaySpent'),
  ],

  // One week
  [
    allPass([
      propEq('timeFilter', TimeFilter.SevenDay),
      propEq('orderByColumn', TrendingCollectorColumn.CreatorsSupported),
    ]),
    always('oneWeekCreatorsSupported'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.SevenDay),
      propEq('orderByColumn', TrendingCollectorColumn.NftsBought),
    ]),
    always('oneWeekNumBought'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.SevenDay),
      propEq('orderByColumn', TrendingCollectorColumn.TotalSpent),
    ]),
    always('oneWeekSpent'),
  ],

  // One month
  [
    allPass([
      propEq('timeFilter', TimeFilter.ThirtyDay),
      propEq('orderByColumn', TrendingCollectorColumn.CreatorsSupported),
    ]),
    always('oneMonthCreatorsSupported'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.ThirtyDay),
      propEq('orderByColumn', TrendingCollectorColumn.NftsBought),
    ]),
    always('oneMonthNumBought'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.ThirtyDay),
      propEq('orderByColumn', TrendingCollectorColumn.TotalSpent),
    ]),
    always('oneMonthSpent'),
  ],

  // All time
  [
    allPass([
      propEq('timeFilter', TimeFilter.AllTime),
      propEq('orderByColumn', TrendingCollectorColumn.CreatorsSupported),
    ]),
    always('totalCreatorsSupported'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.AllTime),
      propEq('orderByColumn', TrendingCollectorColumn.NftsBought),
    ]),
    always('totalNumBought'),
  ],
  [
    allPass([
      propEq('timeFilter', TimeFilter.AllTime),
      propEq('orderByColumn', TrendingCollectorColumn.TotalSpent),
    ]),
    always('totalSpent'),
  ],
]);

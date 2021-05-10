import { config } from 'stitches.config';
import { useMemo, useState } from 'react';
import { useMedia } from 'react-use';
import { compose, flatten, propOr } from 'ramda';
import { InfiniteData } from 'react-query';

import DataTable from 'components/data-table/DataTable';

import { buildUserProfilePath } from 'utils/artwork/artwork';
import {
  getTimeFilterPrefix,
  getTrendingCreatorOrderByField,
} from 'utils/trending';

import useTrendingCreators from 'hooks/queries/hasura/use-trending-creators';

import { TrendingCreator, TrendingCreatorColumn } from 'types/Trending';
import TrendingCreatorColumns from './TrendingCreatorsColumns';

const getFlattenedData = compose<
  InfiniteData<TrendingCreator[]>,
  TrendingCreator[],
  TrendingCreator[]
>(flatten, propOr([], 'pages'));

export default function TrendingCreatorsTable(props) {
  const { activeTimeFilter } = props;

  const [activeColumn, setActiveColumn] = useState(
    TrendingCreatorColumn.TotalVolume
  );

  const orderByField = getTrendingCreatorOrderByField({
    timeFilter: activeTimeFilter,
    orderByColumn: activeColumn,
  });

  const { data, isLoading } = useTrendingCreators({
    orderByField,
  });

  const flattenedData = useMemo(() => getFlattenedData(data), [data]);

  const onlyDataWithSales = flattenedData.filter((d) => {
    const queryField = `${getTimeFilterPrefix(activeTimeFilter)}NumSold`;
    return d[queryField] > 0;
  });

  const isMobile = !useMedia(config.media.bp2);

  const columns = TrendingCreatorColumns(activeTimeFilter, isMobile);

  return (
    <DataTable<TrendingCreator>
      isLoading={isLoading}
      data={onlyDataWithSales}
      columns={columns}
      initialState={{
        sortBy: [{ id: TrendingCreatorColumn.TotalVolume }],
      }}
      onSortBy={(sort) => {
        const sortColumn = TrendingCreatorColumn[sort[0].id];
        setActiveColumn(sortColumn);
      }}
      getLink={(props) => {
        const { original } = props;
        return buildUserProfilePath({ user: original.user });
      }}
      hiddenMobileCols={[
        {
          id: TrendingCreatorColumn.UniqueCollectors,
          label: 'Unique Collectors',
        },
        { id: TrendingCreatorColumn.NftsSold, label: 'NFTs Sold' },
        {
          id: TrendingCreatorColumn.PrimarySales,
          label: 'Primary Sales',
        },
        {
          id: TrendingCreatorColumn.SecondarySales,
          label: 'Secondary Sales',
        },
        { id: TrendingCreatorColumn.TotalVolume, label: 'Total Volume' },
      ]}
      defaultMobileCol={{
        id: TrendingCreatorColumn.TotalVolume,
        label: 'Total Volume',
      }}
    />
  );
}

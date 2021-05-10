import { styled, config } from 'stitches.config';
import { useRef, useState } from 'react';
import NextLink from 'next/link';
import {
  useTable,
  useSortBy,
  useFlexLayout,
  UseSortByOptions,
  TableOptions,
  SortingRule,
  Row,
  IdType,
} from 'react-table';
import { useEffect } from 'react';
import { useIntersection, useMedia } from 'react-use';

import Box from 'components/base/Box';
import Link from 'components/base/Link';
import Text from 'components/base/Text';
import GraySquare from 'components/base/GraySquare';
import SelectField from 'components/forms/fields/SelectField';
import TableRow from 'components/data-table/TableRow';

interface DataTableProps<T1 extends Record<string, unknown>>
  extends TableOptions<T1>,
    UseSortByOptions<T1> {
  onSortBy?: (sorted: SortingRule<T1>[]) => void;
  getLink?: (row: Row<T1>) => string;
  hiddenMobileCols: { id: IdType<T1>; label: string }[];
  defaultMobileCol: { id: IdType<T1>; label: string };
}

const TableHeader = styled(Box, {
  position: 'sticky',
  top: 0,
  paddingTop: '$4',
  paddingBottom: '$4',
  marginBottom: '$6',
  borderBottom: '1px solid $black10',
  backgroundColor: '$white100',
  zIndex: 10,
  transition: 'box-shadow $1 $ease, border-radius $1 $ease',
  variants: {
    isStuck: {
      true: {
        boxShadow: '$1',
        borderRadius: '$1',
      },
    },
  },
});

const ColumnHeader = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$1',
  color: '$black60',
});

const TableCell = styled(Box, { paddingX: '$2' });

const A = styled(Link, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

interface RowLinkProps {
  isActive: boolean;
  isLoading: boolean;
  href: string;
  children: JSX.Element;
}

function RowLink(props: RowLinkProps) {
  const { isActive, isLoading, href, children, ...rest } = props;

  if (isActive && !isLoading) {
    return (
      <TableRow isLinkRow {...rest}>
        <>
          <NextLink href={href} passHref>
            <A />
          </NextLink>
          {children}
        </>
      </TableRow>
    );
  }
  return <TableRow {...rest}>{children}</TableRow>;
}

const skeletonData = new Array(20).fill({});

export default function DataTable<T1 extends Record<string, unknown>>(
  props: DataTableProps<T1>
): JSX.Element {
  const {
    data = [],
    columns = [],
    onSortBy = () => null,
    isLoading,
    getLink,
    hiddenMobileCols,
    defaultMobileCol,
    ...rest
  } = props;

  const tableHeaderRef = useRef(null);
  const [selectedMobileCol, setSelectedMobileCol] = useState(defaultMobileCol);

  const headerIntersection = useIntersection(tableHeaderRef, {
    threshold: 1,
    rootMargin: '-1px 0px 0px 0px',
  });

  const isHeaderStuck = headerIntersection?.intersectionRatio < 1;

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setHiddenColumns,
    toggleHideColumn,
    toggleHideAllColumns,
    toggleSortBy,
  } = useTable<T1>(
    {
      data: isLoading ? skeletonData : data,
      columns,
      manualSortBy: true,
      disableMultiSort: true,
      disableSortRemove: true,
      ...rest,
    },
    useSortBy,
    useFlexLayout
  );

  const isMobile = !useMedia(config.media.bp2);

  useEffect(() => {
    if (!isMobile) {
      toggleHideAllColumns(false);
    } else {
      const hiddenColIds = hiddenMobileCols.map((col) => col.id);
      setHiddenColumns(hiddenColIds);
      toggleHideColumn(selectedMobileCol.id, false);
    }
  }, [
    isMobile,
    selectedMobileCol,
    setHiddenColumns,
    toggleHideColumn,
    toggleHideAllColumns,
    hiddenMobileCols,
  ]);

  useEffect(() => {
    onSortBy(state.sortBy);
  }, [onSortBy, state.sortBy]);

  const handleChangeCol = (selectedItem: { id: IdType<T1>; label: string }) => {
    const hiddenColIds = hiddenMobileCols.map((col) => col.id);
    setSelectedMobileCol(selectedItem);
    setHiddenColumns(hiddenColIds);
    toggleHideColumn(selectedItem.id, false);
    toggleSortBy(selectedItem.id);
  };

  return (
    <Box {...getTableProps()} css={{ position: 'relative' }}>
      <TableHeader ref={tableHeaderRef} isStuck={isHeaderStuck}>
        {headerGroups.map((headerGroup) => (
          <Box
            key={headerGroup.getHeaderGroupProps().key}
            {...headerGroup.getHeaderGroupProps()}
            css={{ alignItems: 'center', position: 'relative' }}
          >
            {headerGroup.headers.map((column) => (
              <Box
                key={column.getHeaderProps().key}
                {...column.getHeaderProps()}
              >
                {column.canSort ? (
                  column.render('Header')
                ) : (
                  <ColumnHeader>{column.render('Header')}</ColumnHeader>
                )}
              </Box>
            ))}
            <Box
              css={{
                position: 'absolute',
                right: isHeaderStuck ? '$4' : 0,
                top: '50%',
                transform: 'translateY(-50%)',
                '@bp2': { display: 'none' },
              }}
            >
              <SelectField<{ id: IdType<T1>; label: string }>
                items={hiddenMobileCols}
                defaultSelectedItem={selectedMobileCol}
                onSelectedItemChange={handleChangeCol}
              />
            </Box>
          </Box>
        ))}
      </TableHeader>

      <Box>
        {rows.map((row) => {
          prepareRow(row);
          const hasGetLinkFn = typeof getLink === 'function';
          const rowLink = hasGetLinkFn ? getLink(row) : '';

          return (
            <RowLink
              isLoading={isLoading}
              key={row.getRowProps().key}
              isActive={hasGetLinkFn}
              href={rowLink}
              {...row.getRowProps()}
            >
              <>
                {row.cells.map((cell) => (
                  <TableCell
                    key={cell.getCellProps().key}
                    {...cell.getCellProps()}
                  >
                    {isLoading ? <GraySquare /> : cell.render('Cell')}
                  </TableCell>
                ))}
              </>
            </RowLink>
          );
        })}
      </Box>
    </Box>
  );
}

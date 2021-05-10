import { useCallback, useState, useEffect } from 'react';

interface Pagination {
  handleNextPage: () => void;
  setCurrentPage: (arg0: number) => void;
  currentPage: number;
}

interface PaginationArgs {
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export default function usePagination({
  fetchNextPage,
}: PaginationArgs): Pagination {
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(
    () => {
      if (currentPage > 0) {
        fetchNextPage();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage]
  );

  const handleNextPage = useCallback(() => {
    setCurrentPage((currentPage) => currentPage + 1);
  }, []);

  return { handleNextPage, currentPage, setCurrentPage };
}

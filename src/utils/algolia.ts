import qs, { ParsedQs } from 'qs';
import { NextRouter } from 'next/router';
import { always, cond, equals } from 'ramda';
import humanize from 'underscore.string/humanize';

export function createUrl(state): string {
  return `?${qs.stringify(state)}`;
}

export function searchStateToUrl(searchState): string {
  return qs.stringify(searchState);
}

export function urlToSearchState(router: NextRouter): ParsedQs {
  const searchIndex = router.asPath.indexOf('?');
  // If url has no search param default to empty state
  if (searchIndex === -1) {
    return {};
  }
  const search = router.asPath.substring(searchIndex + 1);
  const searchParams = qs.parse(search);
  return searchParams;
}

export const formatLabel = cond([
  [equals('3D'), always('3D')],
  [Boolean, humanize],
]);

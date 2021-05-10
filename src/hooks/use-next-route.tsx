import { useRouter } from 'next/router';
import { unless, startsWith } from 'ramda';

const maybePrependSlash = unless(startsWith('/'), (path) => `/${path}`);

export default function useNextRoute(pathname: string): string {
  const router = useRouter();

  const username = router.query?.username;
  const slug = router.query?.slug;

  const basePath = `/${username}/${slug}`;

  return basePath + maybePrependSlash(pathname);
}

export function useNextRouteCreator(pathname: string): string {
  const router = useRouter();

  const slug = router.query?.slug;

  const basePath = `/creator/${slug}`;

  return basePath + maybePrependSlash(pathname);
}

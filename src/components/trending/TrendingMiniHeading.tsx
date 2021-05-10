import { ReactNode } from 'react';
import { styled } from 'stitches.config';
import Link from 'next/link';
import { TimeFilter } from 'types/Trending';
import Flex from 'components/base/Flex';
import TrendingTimeFilters from 'components/trending/TrendingTimeFilters';

const HeadingWrapper = styled('h3', {
  fontFamily: '$body',
  color: '$black100',
  fontSize: '$4',
  fontWeight: 600,
  letterSpacing: -0.8,
  textDecoration: 'none',
});

interface TrendingMiniHeadingProps {
  children: ReactNode;
  setTimeFilter: (activeTimeFilter: TimeFilter) => void;
  activeTimeFilter: TimeFilter;
  href: string;
}

export default function TrendingMiniHeading(
  props: TrendingMiniHeadingProps
): JSX.Element {
  const { setTimeFilter, activeTimeFilter, children, href } = props;
  return (
    <Flex
      css={{
        marginBottom: '$5',
        flexDirection: 'column',
        alignItems: 'center',
        '@bp4': {
          justifyContent: 'space-between',
          flexDirection: 'row',
        },
      }}
    >
      <Link href={href} passHref>
        <HeadingWrapper
          as="a"
          css={{ marginBottom: '$5', '@bp4': { marginBottom: 0 } }}
        >
          {children}
        </HeadingWrapper>
      </Link>
      <Flex>
        <TrendingTimeFilters
          setCurrentTimeFilter={setTimeFilter}
          currentTimeFilter={activeTimeFilter}
        />
      </Flex>
    </Flex>
  );
}

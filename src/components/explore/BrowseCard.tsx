import Link from 'components/links/Link';
import Text from 'components/base/Text';
import { ReactNode } from 'react';
import { styled } from 'stitches.config';

const Callout = styled('div', {
  fontSize: '$5',
  lineHeight: 1.1,
  fontWeight: 600,
  letterSpacing: -2,
  marginTop: '$6',
  display: 'inline-block',
  '@bp1': {
    fontSize: '$7',
  },
});
const BrowseCardWrapper = styled('a', {
  color: 'inherit',
  textDecoration: 'none',
  fontFamily: '$body',
  padding: '$7',
  boxShadow: '$0',
  transition: 'transform $1 $ease, box-shadow $1 $ease',
  borderRadius: '$2',
  flexGrow: 1,
  textAlign: 'center',
  willChange: 'transform',
  '@bp1': {
    textAlign: 'left',
    padding: '$8',
  },
  '@media (hover: hover)': {
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '$2',
      div: {
        color: '$black100',
      },
    },
  },
});

interface BrowseCardProps {
  children: ReactNode;
  statistic: string;
  href: string;
}

export default function BrowseCard(props: BrowseCardProps): JSX.Element {
  const { children, statistic, href } = props;
  return (
    <Link href={href}>
      <BrowseCardWrapper>
        <Text
          css={{
            color: '$black60',
            transition: 'color $1 $ease',
            fontWeight: 600,
          }}
        >
          {statistic}
        </Text>
        <Callout>{children}</Callout>
      </BrowseCardWrapper>
    </Link>
  );
}

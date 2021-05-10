import { HTMLProps, ReactNode } from 'react';

import { styled } from 'stitches.config';

import Link from 'components/base/Link';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import Icon from 'components/Icon';

import OpenLinkIcon from 'assets/icons/open-link-icon.svg';

type AnchorAttributes = HTMLProps<HTMLAnchorElement>;

interface ExternalShadowLinkV2Props
  extends Pick<AnchorAttributes, 'target' | 'rel' | 'className'> {
  href: string;
  children: ReactNode;
  icon: ReactNode;
}

const ShadowLink = styled(Link, {
  display: 'flex',
  backgroundColor: '$white100',
  position: 'relative',
  boxShadow: '$2',
  borderRadius: '$2',
  padding: '$5',
  alignItems: 'center',
  transition: 'box-shadow $1 $ease, transform $1 $ease, color $1 $ease',
  willChange: 'transform, boxShadow',
  textDecoration: 'none',
  color: '$black30',
  cursor: 'pointer',
  '@media (hover: hover)': {
    '&:hover': {
      boxShadow: '$3',
      transform: 'translateY(-2px)',
      color: '$black100',
    },
    '&:active': {
      boxShadow: '$2',
      transform: 'translateY(0)',
    },
  },
});

const Title = styled(Text, {
  color: '$black100',
  fontFamily: '$body',
  fontWeight: 600,
  marginLeft: '$3',
});

export default function ExternalShadowLinkV2(
  props: ExternalShadowLinkV2Props
): JSX.Element {
  const { children, icon, ...attributes } = props;

  return (
    <ShadowLink {...attributes}>
      {icon}
      <Title>{children}</Title>
      <Box css={{ marginLeft: 'auto' }}>
        <Icon icon={OpenLinkIcon} width={16} height={16} />
      </Box>
    </ShadowLink>
  );
}

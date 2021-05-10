import { styled } from 'stitches.config';

import Icon from 'components/Icon';
import Flex from 'components/base/Flex';
import Box from 'components/base/Box';

import CircleIcon from 'assets/icons/circle-back-icon.svg';

import { noop } from 'utils/helpers';
import Link from 'components/links/Link';

export const PreviousPageButtonAnchor = styled(Box, {
  position: 'fixed',
  top: '50%',
  left: '$8',
  transform: 'translateY(-50%)',
});

const PreviousPageButtonContainer = styled(Flex, {
  transition:
    'color $1 $ease, background-color $1 $ease, border-radius $1 $ease, transform $1 $ease',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  cursor: 'pointer',
  color: '$black100',
  width: 50,
  willChange: 'transform',
  '@media (hover: hover)': {
    '&:hover': {
      transform: 'translateY(-2px)',
      color: '$white100',
      backgroundColor: '$black100',
      borderRadius: '$round',
    },
  },
});

interface PreviousPageButtonProps {
  onClick: () => void;
}

export default function PreviousPageButton(
  props: PreviousPageButtonProps
): JSX.Element {
  const { onClick = noop } = props;
  return (
    <PreviousPageButtonContainer onClick={onClick}>
      <Icon icon={CircleIcon} width={50} height={50} />
    </PreviousPageButtonContainer>
  );
}

interface PreviousPageLinkProps {
  href: string;
}

export function PreviousPageLink(props: PreviousPageLinkProps): JSX.Element {
  const { href } = props;
  return (
    <Link href={href}>
      <PreviousPageButtonContainer as="a">
        <Icon icon={CircleIcon} width={50} height={50} />
      </PreviousPageButtonContainer>
    </Link>
  );
}

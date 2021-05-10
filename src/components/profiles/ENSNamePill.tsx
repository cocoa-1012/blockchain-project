import Icon from 'components/Icon';
import Flex from 'components/base/Flex';
import Text from 'components/base/Text';

import ENSIcon from 'assets/icons/ens-icon.svg';

import { styled } from 'stitches.config';

interface ENSNamePillProps {
  ensName: string;
}

const PillContainer = styled(Flex, {
  boxShadow: '$0',
  borderRadius: '$round',
  paddingY: '$3',
  paddingX: '$3',
  textDecoration: 'none',
  transition: 'transform $0 ease-in-out',
  willChange: 'transform',
  position: 'relative',
  zIndex: 3,
  backgroundColor: '$white100',
  '@media (hover: hover)': {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '$1',
    },
  },
});

const PillLabel = styled(Text, {
  marginLeft: '$2',
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$0',
  color: '$black100',
});

export default function ENSNamePill(props: ENSNamePillProps): JSX.Element {
  const { ensName } = props;
  return (
    <Flex css={{ display: 'inline-flex' }}>
      <PillContainer
        as="a"
        href={`https://etherscan.io/enslookup-search?search=${ensName}`}
      >
        <Icon icon={ENSIcon} width={32} height={20} />
        <PillLabel>{ensName}</PillLabel>
      </PillContainer>
    </Flex>
  );
}

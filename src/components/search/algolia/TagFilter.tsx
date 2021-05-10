import { ReactNode } from 'react';
import { styled } from 'stitches.config';

import Text from 'components/base/Text';
import Icon from 'components/Icon';
import Flex from 'components/base/Flex';

import TagIcon from 'assets/icons/icon-tag.svg';
import RemoveIcon from 'assets/icons/close-icon-bold.svg';
import HoverableIcon from 'components/HoverableIcon';

interface TagFilterProps {
  children: ReactNode;
  onClick: () => void;
}

const CloseIconContainer = styled(HoverableIcon, {
  padding: '$2',
  cursor: 'pointer',
});

const TagFilterWrapper = styled(Flex, {
  background: '$black5',
  borderRadius: '$2',
  padding: '$4',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export default function TagFilter(props: TagFilterProps): JSX.Element {
  const { children, onClick } = props;

  return (
    <TagFilterWrapper>
      <Flex css={{ alignItems: 'center' }}>
        <Icon icon={TagIcon} width={22} height={24} />
        <Text
          css={{
            fontFamily: '$body',
            fontSize: '$1',
            fontWeight: 600,
            marginLeft: '$2',
          }}
        >
          {children}
        </Text>
      </Flex>

      <CloseIconContainer onClick={onClick}>
        <Icon icon={RemoveIcon} width={10} height={10} />
      </CloseIconContainer>
    </TagFilterWrapper>
  );
}

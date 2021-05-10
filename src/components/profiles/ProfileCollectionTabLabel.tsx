import Text from 'components/base/Text';

import { css } from 'stitches.config';

export const lastTabStyles = css({
  position: 'relative',
  marginLeft: '$6',
  color: '$black20',
  '@media (hover: hover)': {
    '&:hover': {
      color: '$black100',
    },
  },
  '&:after': {
    position: 'absolute',
    left: '-$6',
    top: '0px',
    content: '',
    height: '24px',
    borderLeft: 'solid 1px $black20',
  },
})();

interface ProfileCollectionTabLabelProps {
  label: string;
  count: number;
  showCount: boolean;
  isActive?: boolean;
}

export default function ProfileCollectionTabLabel(
  props: ProfileCollectionTabLabelProps
): JSX.Element {
  const { label, count, isActive, showCount } = props;
  return (
    <Text
      css={{
        color: isActive && '$black100',
        transition: 'color $0 ease',
        '@media (hover: hover)': {
          '&:hover': {
            color: 'currentColor',
          },
        },
      }}
    >
      {label}
      {showCount && (
        <Text as="span" css={{ marginLeft: '$3', fontWeight: 400 }}>
          {count}
        </Text>
      )}
    </Text>
  );
}

import { styled } from 'stitches.config';

import Text from 'components/base/Text';

const TabHeading = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$2',
  borderBottom: '1px solid rgba(0,0,0,0)',
  paddingBottom: '$5',
  borderWidth: 2,
  marginBottom: -2,
  marginRight: '$6',
  transition: 'border-color $1 $ease',
  cursor: 'pointer',
  lineHeight: 1.2,
  variants: { isActive: { true: { borderColor: '$black100' } } },
});

export default TabHeading;

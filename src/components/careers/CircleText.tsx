import { styled } from 'stitches.config';

const CircleText = styled('div', {
  backgroundColor: '$black80',
  color: '$white100',
  fontSize: '$2',
  width: 28,
  height: 28,
  lineHeight: '28px',
  borderRadius: '50%',
  textAlign: 'center',
  marginRight: '$2',
  variants: {
    size: {
      title: {
        background: '$blue100',
        '@bp1': {
          width: 52,
          height: 52,
          fontSize: '$4',
          lineHeight: '53px',
          marginRight: '$5',
        },
      },
    },
  },
});

export default CircleText;

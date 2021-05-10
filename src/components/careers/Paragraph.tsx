import { styled } from 'stitches.config';

const Paragraph = styled('p', {
  fontFamily: '$body',
  letterSpacing: -0.5,
  fontSize: '$2',
  lineHeight: 1.6,
  fontWeight: 400,
  a: {
    color: '$black100',
    fontFamily: '$body',
    textDecoration: 'none',
    borderBottom: '1px solid $black10',
    transition: 'color $1 $ease, border-bottom $ease',
    '@media (hover: hover)': {
      '&:hover': {
        color: '$blue100',
        borderBottomColor: '$blue100',
      },
    }

  },
});

export default Paragraph;

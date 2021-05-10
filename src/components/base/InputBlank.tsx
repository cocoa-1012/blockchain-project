import { styled } from 'stitches.config';

const InputBlank = styled('input', {
  fontFamily: '$body',
  lineHeight: 1,
  fontSize: '$2',
  display: 'flex',
  alignItems: 'center',
  borderRadius: 0,
  appearance: 'none',
  paddingLeft: 0,
  paddingRight: 0,
  fontWeight: 600,
  border: 'none',

  '&:focus': {
    outline: 'none',
  },
});

export default InputBlank;

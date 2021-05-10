import { ThemeUIStyleObject } from '@theme-ui/css';
import { transitions } from 'utils/themes/main/theme';

export const userLink: ThemeUIStyleObject = {
  display: 'flex',
  justifyContent: 'flex-start',
  textDecoration: 'none',
};

export const userTag: ThemeUIStyleObject = {
  padding: [8, 11],
  background: '#ffffff',
  display: 'flex',
  boxShadow: 's',
  alignItems: 'center',
  borderRadius: '9999px',
  transition: transitions.smooth.fast,
  willChange: 'transform',
  '@media (hover: hover)': {
    '&:hover': {
      boxShadow: 'm',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      boxShadow: 's',
      transform: 'translateY(0)',
    },
  },
};

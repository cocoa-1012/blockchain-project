import { ThemeUIStyleObject } from 'theme-ui';
import { transitions } from './themes/main/theme';

export const hasError = (meta: any, forceError: boolean): boolean =>
  (meta.error && meta.touched) || (meta.error && forceError);

export const getErrorStyles = (errorVisible: boolean): any => {
  const inputShadow = `inset 0 0 0 2px #F93A3A, 0px 10px 20px rgba(0,0,0,0.1)`;
  if (errorVisible) {
    return {
      boxShadow: inputShadow,
      '&:focus': {
        boxShadow: inputShadow,
      },
    };
  }
};

export const inlineLinkStyles: ThemeUIStyleObject = {
  color: 'black.60',
  transition: transitions.smooth.fast,
  cursor: 'pointer',
  '@media (hover: hover)': {
    '&:hover': {
      color: 'black.100',
    },
  },
};

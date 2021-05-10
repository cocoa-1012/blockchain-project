import { ThemeUIStyleObject } from 'theme-ui';

export const getHeaderStyles = (absolute: boolean) => {
  const container: ThemeUIStyleObject = {
    position: absolute ? 'absolute' : 'relative',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 999,
  };

  const grid: ThemeUIStyleObject = {
    gridTemplateColumns: ['108px auto', null, '240px auto'],
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: ['m', 'l'],
  };

  const logo: ThemeUIStyleObject = {
    paddingLeft: [null, 10],
  };

  return {
    container,
    grid,
    logo,
  };
};

export const overlayStyles: ThemeUIStyleObject = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  visibility: 'hidden',
  transform: 'unset',
  pointerEvents: 'none',
  backfaceVisibility: 'unset',
};

export const headerContainerStyles: ThemeUIStyleObject = {
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: ['m', null, 0],
  position: 'relative',
};

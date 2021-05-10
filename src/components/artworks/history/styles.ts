import { ThemeUIStyleObject } from '@theme-ui/css';

export const getEventStyles = () => {
  const amount: ThemeUIStyleObject = {
    order: [1, 2],
    alignItems: [null, 'center'],
  };

  const link: ThemeUIStyleObject = {
    position: ['absolute', 'relative'],
    right: [20, 0],
    bottom: [20, 0],
    marginLeft: [0, 'm'],
  };

  const info: ThemeUIStyleObject = {
    display: ['grid', 'flex'],
    flex: 1,
    flexDirection: ['column', 'row'],
    gap: [5, 0],
  };

  const details: ThemeUIStyleObject = {
    flex: 1,
    order: [2, 1],
    marginRight: [0, 'm'],
  };

  const text: ThemeUIStyleObject = {
    fontSize: ['sub', 'body'],
  };

  return { amount, link, info, text, details };
};

import { ThemeUIStyleObject } from '@theme-ui/css';
import { CardDimension } from 'types/Card';
import { transitions } from 'utils/themes/main/theme';

interface LinkStyles {
  link: ThemeUIStyleObject;
  bigLink: ThemeUIStyleObject;
  hoverable: ThemeUIStyleObject;
  bigHoverable: ThemeUIStyleObject;
}

export const getLinkStyles = (): LinkStyles => {
  const link: ThemeUIStyleObject = {
    backgroundColor: 'white.100',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: 'black.100',
    fontFamily: 'body',
    fontSize: ['s', null, 'xs'],
    boxShadow: 's',
    paddingX: 12,
    paddingTop: 12,
    paddingBottom: 13,
    borderRadius: 999,
    maxHeight: 44,
    transition: transitions.smooth.fast,
    '@media (hover: hover)': {
      '&:hover': {
        boxShadow: 'm',
      },
      '&:active': {
        boxShadow: 's',
      },
    },
  };

  const bigLink: ThemeUIStyleObject = {
    backgroundColor: 'white.100',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: 'black.100',
    fontFamily: 'body',
    fontSize: ['s', null, 'xs'],
    boxShadow: 's',
    paddingX: 22,
    paddingTop: 22,
    paddingBottom: 23,
    borderRadius: 999,
    transition: transitions.smooth.fast,
    '@media (hover: hover)': {
      '&:hover': {
        boxShadow: 'm',
      },
      '&:active': {
        boxShadow: 's',
      },
    },
  };

  const hoverable: ThemeUIStyleObject = {
    ...link,
    transition: transitions.smooth.fast,
    willChange: 'transform, box-shadow',
    '& .delete-icon': {
      opacity: 0,
      display: 'none !important',
    },
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-2px)',
        '& .verified-icon': {
          opacity: 0,
          display: 'none !important',
        },
        '& .delete-icon': {
          opacity: 1,
          display: 'block !important',
        },
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
  };

  const bigHoverable: ThemeUIStyleObject = {
    ...bigLink,
    transition: transitions.smooth.fast,
    willChange: 'transform, box-shadow',
    '& .delete-icon': {
      opacity: 0,
      display: 'none !important',
    },
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-2px)',
        '& .verified-icon': {
          opacity: 0,
          display: 'none !important',
        },
        '& .delete-icon': {
          opacity: 1,
          display: 'block !important',
        },
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
  };

  return { link, bigLink, hoverable, bigHoverable };
};

interface ButtonStyles {
  button: ThemeUIStyleObject;
  warningButton: ThemeUIStyleObject;
  darkButton: ThemeUIStyleObject;
}

export const getButtonStyles = (size: CardDimension): ButtonStyles => {
  const isSmall = size === CardDimension.small;

  const button: ThemeUIStyleObject = {
    borderColor: 'black.10',
    minWidth: isSmall ? 110 : 130,
    fontSize: isSmall ? 'body' : 'xs',
    borderRadius: 999,
    minHeight: 56,
    paddingX: ['s', 's', 's'],
    lineHeight: 1.25,
    '@media (hover: hover)': {
      '&:hover': {
        borderColor: 'black.100',
      },
    },
  };

  const darkButton: ThemeUIStyleObject = {
    ...button,
    borderColor: 'black.60',
    color: 'white.100',
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: 'white.100',
        borderColor: 'white.100',
        color: 'black.100',
      },
    },
  };

  const warningButton: ThemeUIStyleObject = {
    ...button,
    backgroundColor: 'utility.red',
    border: 'solid 2px',
    borderColor: 'utility.red',
    '@media (hover: hover)': {
      '&:hover': {
        borderColor: 'utility.red',
      },
    },
  };

  return { button, darkButton, warningButton };
};

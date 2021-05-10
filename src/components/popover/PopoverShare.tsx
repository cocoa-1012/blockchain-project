/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Box } from 'theme-ui';
import { useLocation } from 'react-use';
import { TippyProps } from '@tippyjs/react';

import UploadIcon from 'assets/icons/upload-icon.svg';
import TwitterIcon from 'assets/icons/twitter-icon.svg';
import CopyIcon from 'assets/icons/copy-icon.svg';
import SuccessIcon from 'assets/icons/success-icon.svg';

import Popover from './Popover';
import PopoverButton from './PopoverButton';
import PopoverMenu from './PopoverMenu';

import { StyleObject } from 'types/styles';
import { PopoverMenuOption } from './types';

import useCopyText from 'hooks/use-copy-text';
import { transitions } from 'utils/themes/main/theme';

interface PopoverShareProps extends TippyProps {
  className?: string;
  shareText: string;
}

export default function PopoverShare(props: PopoverShareProps): JSX.Element {
  const { className, shareText, placement = 'top-end' } = props;

  const sx = getStyles();

  const { href } = useLocation();
  const { hasCopied, handleCopy } = useCopyText(href);

  const options: PopoverMenuOption[] = [
    {
      icon: <TwitterIcon sx={{ display: 'block' }} width={24} height={24} />,
      children: 'Tweet',
      externalHref: `https://twitter.com/intent/tweet?text=${encodeURI(
        shareText
      )}`,
    },
    {
      icon: hasCopied ? (
        <SuccessIcon sx={{ display: 'block' }} width={20} height={20} />
      ) : (
        <CopyIcon sx={{ display: 'block' }} width={20} height={20} />
      ),
      children: 'Copy Link',
      onClick: () => {
        handleCopy();
      },
    },
  ];

  return (
    <Popover
      sx={sx.popover}
      button={
        <PopoverButton sx={sx.button}>
          <Box sx={{ transform: [`scale(0.85)`, `scale(1)`] }}>
            <UploadIcon sx={{ display: 'block' }} width={24} height={24} />
          </Box>

          <Text
            variant="h.body"
            sx={{
              marginLeft: 10,
              display: ['none', 'block'],
              position: 'relative',
              top: -2,
            }}
          >
            Share
          </Text>
        </PopoverButton>
      }
      className={className}
      placement={placement}
    >
      <PopoverMenu options={options} />
    </Popover>
  );
}

const getStyles = (): StyleObject => ({
  popover: {
    outline: 'none',
    transition: transitions.smooth.fast,
    borderRadius: 999,
    willChange: 'transform',
    backfaceVisibility: 'visible',
    '&[aria-expanded=true]': {
      transform: 'translateY(0) !important',
      boxShadow: 'none !important',
    },
    '@media (hover: hover)': {
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 'm',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
  },
  button: {
    width: 'auto',
    backgroundColor: '#fff !important',
    display: 'flex',
    alignItems: 'center',
    minHeight: [40, 56],
    paddingX: ['s', 'm'],
    boxShadow: 's',
  },
});

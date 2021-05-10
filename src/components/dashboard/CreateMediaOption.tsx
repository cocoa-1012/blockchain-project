/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Grid, Flex, ThemeUIStyleObject } from 'theme-ui';

import Link from 'components/links/Link';
import MediaOption from 'types/MediaType';
import { transitions } from 'utils/themes/main/theme';

interface CreateMediaOptionProps {
  option: MediaOption;
}

export default function CreateMediaOption(
  props: CreateMediaOptionProps
): JSX.Element {
  const { option } = props;

  const sx = getStyles();

  return (
    <Link href={option.href}>
      <a
        sx={{
          ...sx.box,
          backgroundColor: option.comingSoon ? 'black.5' : 'white.100',
          pointerEvents: option.comingSoon ? 'none' : 'all',
        }}
      >
        <Flex sx={sx.icon}>{option.icon}</Flex>
        <Flex sx={sx.info}>
          <Text variant="h.s" sx={{ lineHeight: 1, marginBottom: 20 }}>
            {option.mediaTitle}
          </Text>
          <Grid gap="l">
            <Text variant="stnd.body" sx={{ color: 'black.40', lineHeight: 1 }}>
              {option.mediaLabel}
            </Text>
            {option.comingSoon && <ComingSoonTag />}
            {option.newOption && <NewTag />}
          </Grid>
        </Flex>
      </a>
    </Link>
  );
}

function ComingSoonTag(): JSX.Element {
  return (
    <Text
      sx={{
        textTransform: 'uppercase',
        backgroundColor: 'black.100',
        color: 'white.100',
        paddingX: 20,
        paddingY: 'xs',
        borderRadius: 999,
        letterSpacing: 1,
      }}
      variant="mono.sub"
    >
      Coming soon
    </Text>
  );
}

function NewTag(): JSX.Element {
  return (
    <Text
      sx={{
        textTransform: 'uppercase',
        background: 'linear-gradient(97.5deg, #4200FF 2.66%, #CC00FF 94.94%)',
        color: 'white.100',
        paddingX: 10,
        paddingY: 'xs',
        borderRadius: 999,
        letterSpacing: 1,
      }}
      variant="mono.sub"
    >
      New
    </Text>
  );
}

const getStyles = () => {
  const box: ThemeUIStyleObject = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 410,
    boxShadow: 's',
    borderRadius: 10,
    backgroundColor: 'white.100',
    transition: transitions.smooth.fast,
    paddingBottom: 'xl',
    textDecoration: 'none',
    color: 'inherit',
    alignItems: 'center',
    willChange: 'transform',
    '@media (hover: hover)': {
      '&:hover': {
        boxShadow: 'm',
        transform: 'translateY(-4px)',
      },
      '&:active': {
        boxShadow: 's',
        transform: 'translateY(0)',
      },
    },
  };

  const icon: ThemeUIStyleObject = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const info: ThemeUIStyleObject = {
    flexDirection: 'column',
    textAlign: 'center',
  };

  return { box, info, icon };
};

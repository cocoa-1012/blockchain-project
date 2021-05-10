/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Box } from 'theme-ui';
import { ReactNode } from 'react';

import Body from 'components/Body';

import { positionAbsolute, positionRelative } from 'types/styles';

interface HeaderContainerProps {
  children: ReactNode;
  className?: string;
  absolute: boolean;
}

export default function HeaderContainer(
  props: HeaderContainerProps
): JSX.Element {
  const { children, className, absolute } = props;
  return (
    <Box id="header">
      <Box
        className={className}
        sx={{
          position: absolute ? positionAbsolute : positionRelative,
          left: 0,
          zIndex: 999,
          width: '100%',
        }}
      >
        <Body sx={{ paddingTop: ['m', 'l'] }}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {children}
          </Flex>
        </Body>
      </Box>
    </Box>
  );
}

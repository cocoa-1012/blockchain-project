/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Flex, Button } from 'theme-ui';
import { ReactNode } from 'react';

import Link from 'components/links/Link';

interface ViewAllButtonProps {
  href: string;
  children: ReactNode;
}

export default function HomePageButton(props: ViewAllButtonProps): JSX.Element {
  const { href, children } = props;
  return (
    <Flex sx={{ justifyContent: 'center' }}>
      <Link href={href}>
        <Button
          as="a"
          variant="ghost"
          sx={{
            fontSize: 'xs',
            borderColor: 'black.10',
            height: 56,
            paddingTop: 14,
            '@media (hover: hover)': {
              '&:hover': {
                borderColor: 'black.100',
                transform: 'translateY(-4px)',
              },
            },
          }}
        >
          {children}
        </Button>
      </Link>
    </Flex>
  );
}

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Button } from 'theme-ui';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PreviewMode(): JSX.Element {
  const router = useRouter();

  return (
    <Box sx={{ position: 'fixed', bottom: 24, left: 24, zIndex: 999999 }}>
      <Link href={`/api/preview/disable?redirect=${router.asPath}`} passHref>
        <Button
          as="a"
          variant={'primary'}
          sx={{
            fontSize: 'xs',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 999,
            minHeight: 54,
            maxHeight: 54,
            backgroundColor: 'ticker.pink',
            borderColor: 'ticker.pink',
            '&:hover': {
              backgroundColor: 'ticker.pink',
            },
          }}
        >
          Exit Preview Mode
        </Button>
      </Link>
    </Box>
  );
}

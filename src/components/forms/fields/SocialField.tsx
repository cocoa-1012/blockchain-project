/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Input, Grid, Flex, Box, Text } from 'theme-ui';
import { useField } from 'formik';
import { ReactNode } from 'react';
import { useMeasure } from 'react-use';

import ErrorField from 'components/forms/fields/ErrorField';

interface SocialFieldProps {
  icon: ReactNode;
  title: string;
  urlPrefix?: string;
  name: string;
  className?: string;
}

export default function SocialField(props: SocialFieldProps): JSX.Element {
  const { icon, title, urlPrefix, className } = props;

  const [field, meta] = useField(props);
  const [widthRef, { width }] = useMeasure();

  const isNarrow = width < 540;

  return (
    <Box>
      <Box ref={widthRef} />
      <Grid
        columns={isNarrow ? 1 : 2}
        gap={0}
        sx={{
          alignItems: 'center',
          bg: 'black.5',
          borderRadius: 10,
          border: 'solid 1px',
          borderColor: 'black.10',
        }}
      >
        <Flex sx={{ alignItems: 'center', pl: 's', pr: 's', py: 's' }}>
          <Flex sx={{ alignItems: 'center' }}>
            {icon && <Box mr="xs">{icon}</Box>}
            {title && <Text variant="h.xs">{title}</Text>}
          </Flex>
          {urlPrefix && (
            <Text variant="stnd.sub" sx={{ color: 'black.50', ml: 'auto' }}>
              {urlPrefix}
            </Text>
          )}
        </Flex>

        <Box m={-1}>
          <Input {...field} {...props} className={className} />
        </Box>
      </Grid>
      <ErrorField meta={meta} />
    </Box>
  );
}

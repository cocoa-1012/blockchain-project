/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Box, Heading, Text, Flex } from 'theme-ui';
import { cond, equals, always } from 'ramda';
import { ReactNode } from 'react';

import ModerationStatus from 'types/ModerationStatus';
import Body from 'components/Body';
import Icon from 'components/Icon';

import SuspendedIcon from 'assets/icons/suspended-icon.svg';
import UnderReviewIcon from 'assets/icons/under-review-icon.svg';
import DMCAIcon from 'assets/icons/dmca-icon.svg';

interface WarningBlockProps {
  title: string;
  description: ReactNode;
  icon: ModerationStatus;
}

export const renderIcon = cond<ModerationStatus, JSX.Element>([
  [
    equals(ModerationStatus.Suspended),
    always(<SuspendedIcon sx={{ display: 'block' }} />),
  ],
  [
    equals(ModerationStatus.UnderReview),
    always(<UnderReviewIcon sx={{ display: 'block' }} />),
  ],
  [
    equals(ModerationStatus.TakedownRequested),
    always(<Icon icon={DMCAIcon} width={22} height={26} />),
  ],
]);

export default function WarningBlock(props: WarningBlockProps): JSX.Element {
  const { title, description, icon } = props;
  return (
    <Body
      sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box>
        <Grid gap="l">
          <Flex sx={{ width: 46, mx: 'auto' }}>{renderIcon(icon)}</Flex>
          <Grid gap="m">
            <Heading
              variant="h.m"
              sx={{ textAlign: 'center', maxWidth: 440, marginX: 'auto' }}
            >
              {title}
            </Heading>
            <Text
              variant="body.body"
              sx={{ textAlign: 'center', maxWidth: 340, marginX: 'auto' }}
            >
              {description}
            </Text>
          </Grid>
        </Grid>
      </Box>
    </Body>
  );
}

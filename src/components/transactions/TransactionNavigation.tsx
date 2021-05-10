/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Box, Text } from 'theme-ui';
import classNames from 'classnames';
import { Global, css } from '@emotion/react';

import {
  positionAbsolute,
  positionRelative,
  textAlignCenter,
} from 'types/styles';
import { NavigationStep } from 'types/NavigationStep';

import { transitions } from 'utils/themes/main/theme';

import useNavigationFlow from 'state/stores/navigation-flow';

interface TransactionNavigationProps {
  className?: string;
  navigationSteps: NavigationStep[];
}

export default function TransactionNavigation(
  props: TransactionNavigationProps
): JSX.Element {
  const { className, navigationSteps } = props;

  const stepCount = navigationSteps.length;

  const { percentCompleted, activeStep, progressBarEnabled } =
    useNavigationFlow((state) => state);

  const isFirstStep = percentCompleted === 0;

  const sx = getStyles({ stepCount });

  console.log({ isFirstStep });

  if (!progressBarEnabled) {
    return null;
  }

  return (
    <Box
      sx={sx.relative}
      className={classNames({ [className]: true, 'transaction-nav': true })}
    >
      <Grid sx={sx.container}>
        <Box sx={sx.progress} />
        <Box
          sx={sx.rainbow}
          style={{
            width: isFirstStep
              ? `calc(${percentCompleted}% + 50px)`
              : `${percentCompleted}%`,
          }}
        />
      </Grid>
      <Grid sx={sx.steps}>
        {navigationSteps.map((navigationStep, key) => {
          const isCurrentStep = activeStep === navigationStep?.name;
          return (
            <Box key={key} sx={sx.step} className="step">
              <Text
                variant="h.body"
                sx={{
                  color: isCurrentStep ? 'black.100' : 'black.50',
                  transition: transitions.smooth.snail,
                }}
              >
                <Text variant="h.body" as="span">
                  {navigationStep.name}
                </Text>
              </Text>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}

export function HideTransactionLayoutNav(): JSX.Element {
  return (
    <Global
      styles={css`
        .transaction-nav {
          display: none;
        }
      `}
    />
  );
}

const getStyles = ({ stepCount }) => ({
  relative: {
    position: positionRelative,
    width: '100%',
    maxWidth: 920,
    marginX: 'auto',
  },
  steps: {
    position: positionAbsolute,
    top: 'calc(100% + 24px)',
    width: '100%',
    gridTemplateColumns: `repeat(${stepCount}, 1fr)`,
    justifyContent: 'space-between',
    gridGap: 0,

    '& > div:first-of-type': {
      marginLeft: 0,

      '& span': {
        transform: 'translateX(-50%)',
      },
    },
    '& > div:last-of-type': {
      marginRight: 0,
      '& span': {
        transform: 'translateX(-50%)',
      },
    },
  },
  step: {
    maxWidth: 120,
    marginX: 'auto',
    textAlign: textAlignCenter,
    color: 'black.50',
  },
  container: {
    boxShadow: 's',
    backgroundColor: 'white.100',
    paddingY: 's',
    paddingX: 'm',
    borderRadius: 999,
    gridTemplateRows: '4px',
    gridTemplateColumns: '1fr',
    gridGap: 0,
  },
  progress: {
    gridColumn: '1/1',
    gridRow: '1/1',
    height: 4,
    backgroundColor: 'black.10',
    borderRadius: 999,
    width: '100%',
  },
  rainbow: {
    gridColumn: '1/1',
    gridRow: '1/1',
    height: 4,
    borderRadius: 999,
    transition: transitions.smooth.fast,
    background:
      'linear-gradient(89.98deg, #76E650 0%, #F9D649 12.5%, #F08E35 25%, #EC5157 37.5%, #FF18BD 50%, #1A4BFF 62.5%, #62D8F9 75%, #76E650 87.5%)',
    backgroundSize: '400px auto',
  },
});

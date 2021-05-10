import { useCallback, useState } from 'react';
import { useHarmonicIntervalFn } from 'react-use';

import {
  calculateTimeDifferenceInParts,
  getTimeDifferenceParts,
} from 'utils/dates/dates';
import { isEmptyOrNil, padNumber } from 'utils/helpers';

export interface CountdownPart {
  shortLabel?: string;
  label: string;
  value: number;
  formattedValue?: string;
}

interface Countdown {
  countdownParts: CountdownPart[];
  hasEnded: boolean;
}

export default function useCountdown(timestamp: string): Countdown {
  const getTimeDifference = useCallback(
    () => calculateTimeDifferenceInParts(timestamp),
    [timestamp]
  );

  const [{ days, hours, minutes, seconds }, setCountdown] = useState(
    getTimeDifference
  );

  const setTimeDifference = useCallback(
    () => setCountdown(getTimeDifference()),
    [getTimeDifference]
  );

  // refetch every 1s
  useHarmonicIntervalFn(setTimeDifference, 1000);

  const countdownParts = [
    {
      shortLabel: 'd',
      label: 'Days',
      value: days,
      formattedValue: padNumber(days, 1),
    },
    {
      shortLabel: 'h',
      label: 'Hours',
      value: hours,
      formattedValue: padNumber(hours, 2),
    },
    {
      shortLabel: 'm',
      label: 'Minutes',
      value: minutes,
      // gives us 01 vs. 1
      formattedValue: padNumber(minutes, 2),
    },
    {
      shortLabel: 's',
      label: 'Seconds',
      value: seconds,
      // gives us 01 vs. 1
      formattedValue: padNumber(seconds, 2),
    },
  ];

  const formattedParts = getTimeDifferenceParts(countdownParts);

  return {
    countdownParts: formattedParts,
    hasEnded: isEmptyOrNil(formattedParts),
  };
}

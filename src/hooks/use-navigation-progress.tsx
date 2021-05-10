import { useEffect } from 'react';

import useNavigationFlow from 'state/stores/navigation-flow';
import { NavigationStep } from 'types/NavigationStep';

interface NavigationProgress {
  percentCompleted: number;
  activeStep?: NavigationStep['name'];
}

export default function useNavigationProgress({
  percentCompleted,
  activeStep,
}: NavigationProgress): void {
  const { setActiveStep, setPercentCompleted } = useNavigationFlow(
    (state) => state
  );

  useEffect(() => {
    if (activeStep) {
      setActiveStep(activeStep);
    }
  }, [activeStep, setActiveStep]);

  useEffect(() => {
    setPercentCompleted(percentCompleted);
  }, [percentCompleted, setPercentCompleted]);
}

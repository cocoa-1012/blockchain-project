import create from 'zustand';

import { NavigationStep } from 'types/NavigationStep';
export interface NavigationFlowState {
  percentCompleted: number;
  setPercentCompleted: (step: number) => void;
  activeStep: NavigationStep['name'];
  setActiveStep: (activeStep: NavigationStep['name']) => void;
  progressBarEnabled: boolean;
  setProgressBarEnabled: (enabled: boolean) => void;
}

const useNavigationFlowState = create<NavigationFlowState>((set) => ({
  percentCompleted: 0,
  setPercentCompleted: (percentCompleted: number) => set({ percentCompleted }),
  activeStep: null,
  setActiveStep: (activeStep: NavigationStep['name']) => set({ activeStep }),
  progressBarEnabled: true,
  setProgressBarEnabled: (progressBarEnabled: boolean) =>
    set({ progressBarEnabled }),
}));

export default useNavigationFlowState;

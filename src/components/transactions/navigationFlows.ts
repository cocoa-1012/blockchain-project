import { NavigationStep } from 'types/NavigationStep';

export enum CreatorFlowStep {
  Upload = 'Upload',
  Mint = 'Mint',
  Tags = 'Tags',
  List = 'List',
}

export const creatorFlowSteps: NavigationStep[] = [
  { name: CreatorFlowStep.Upload },
  { name: CreatorFlowStep.Mint },
  { name: CreatorFlowStep.Tags },
  { name: CreatorFlowStep.List },
];

export const privateSaleFlowSteps: NavigationStep[] = [
  { name: 'Setup' },
  { name: 'Confirm' },
  { name: 'Send' },
];

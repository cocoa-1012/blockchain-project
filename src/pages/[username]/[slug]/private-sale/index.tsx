import { WrappedTransactionLayoutWithCard } from 'components/layouts/TransactionLayoutWithCard';
import { privateSaleFlowSteps } from 'components/transactions/navigationFlows';

import Artwork from 'types/Artwork';

PrivateSaleIndex.getLayout = WrappedTransactionLayoutWithCard({
  title: 'Create a private sale',
  navigationSteps: privateSaleFlowSteps,
});

export default function PrivateSaleIndex(): JSX.Element {
  return <div></div>;
}

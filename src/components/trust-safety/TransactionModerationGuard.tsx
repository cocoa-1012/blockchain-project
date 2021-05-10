import { HideTransactionLayoutNav } from 'components/transactions/TransactionNavigation';
import ModerationStatus from 'types/ModerationStatus';
import renderTransactionWarningBlock from './TransactionWarningBlock';

interface TransactionModerationGuardProps {
  moderationStatus: ModerationStatus;
}

export default function TransactionModerationGuard(
  props: TransactionModerationGuardProps
): JSX.Element {
  const { moderationStatus } = props;
  return (
    <>
      <HideTransactionLayoutNav />
      {renderTransactionWarningBlock(moderationStatus)}
    </>
  );
}

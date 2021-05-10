import LoadingPage from 'components/LoadingPage';
import { HideTransactionLayoutNav } from './TransactionNavigation';

export default function TransactionLoadingPage(): JSX.Element {
  return (
    <>
      <HideTransactionLayoutNav />
      <LoadingPage />
    </>
  );
}

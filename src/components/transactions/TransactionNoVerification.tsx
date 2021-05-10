import TransactionContent from 'components/transactions/TransactionContent';
import Button from 'components/base/Button';
import Link from 'components/links/Link';

import useNextRoute from 'hooks/use-next-route';

export default function TransactionNoVerification(): JSX.Element {
  const nextRoute = useNextRoute('/');

  return (
    <TransactionContent
      title="This creator’s profile is missing social verification"
      description="Bids cannot be placed on artwork from a creator who has removed their social verification."
    >
      <Link href={nextRoute}>
        <Button
          color="black"
          size="large"
          shape="regular"
          as="a"
          css={{ width: 230 }}
        >
          Back to artwork
        </Button>
      </Link>
    </TransactionContent>
  );
}

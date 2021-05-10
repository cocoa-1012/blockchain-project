import Grid from 'components/base/Grid';
import SplitsBreakdownRow from './SplitsBreakdownRow';

import { ShareWithUser } from 'types/Split';

interface SplitsBreakdownProps {
  splits: ShareWithUser[];
}

export default function SplitsBreakdown(
  props: SplitsBreakdownProps
): JSX.Element {
  const { splits } = props;
  return (
    <Grid css={{ gap: '$7' }}>
      {splits.map((split, index) => (
        <SplitsBreakdownRow
          key={split.account.id}
          split={split}
          index={index}
        />
      ))}
    </Grid>
  );
}

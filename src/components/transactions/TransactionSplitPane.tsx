import Grid from 'components/base/Grid';
import { styled } from 'stitches.config';

const TransactionSplitPane = styled(Grid, {
  gridTemplateColumns: '340px auto',
  gap: '$7',
});

export default TransactionSplitPane;

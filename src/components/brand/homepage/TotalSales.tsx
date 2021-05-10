import ETHinUSD from 'components/ETHinUSD';
import { styled } from 'stitches.config';
import { formatInteger } from 'utils/formatters';

interface TotalSalesProps {
  eth: number;
}

const ETH = styled('h3', {
  fontFamily: '$mono',
  fontSize: '$5',
  '@bp1': {
    fontSize: '$9',
  },
});

const USD = styled('h3', {
  fontFamily: '$mono',
  fontSize: '$2',
  color: '#757575',
});

export default function TotalSales(props: TotalSalesProps): JSX.Element {
  const { eth } = props;
  return (
    <>
      <ETH>{formatInteger(eth)} ETH</ETH>
      <USD>
        <ETHinUSD amount={eth.toString()} />
      </USD>
    </>
  );
}

import Icon from 'components/Icon';
import ExternalShadowLinkV2 from 'components/links/ExternalShadowLinkV2';

import EtherscanIcon from 'assets/icons/etherscan-icon.svg';

import { buildEtherscanLink } from 'lib/etherscanAddresses';

interface SplitsContractLinkProps {
  contractAddress: string;
}

export default function SplitsContractLink(
  props: SplitsContractLinkProps
): JSX.Element {
  const { contractAddress } = props;

  return (
    <ExternalShadowLinkV2
      icon={<Icon icon={EtherscanIcon} width={21} height={21} />}
      href={buildEtherscanLink(`/address/${contractAddress}#code`)}
      target="_blank"
      rel="noreferrer"
    >
      View Split Contract
    </ExternalShadowLinkV2>
  );
}

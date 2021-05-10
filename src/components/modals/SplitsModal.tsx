/* eslint-disable react/jsx-max-depth */
import { css } from 'stitches.config';

import ModalContainer from './common/ModalContainer';
import ModalContent from './common/ModalContent';
import ModalCloseButton from './ModalCloseButton';
import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import Grid from 'components/base/Grid';
import SplitsBreakdown from 'components/splits/SplitsBreakdown';
import SplitsContractLink from 'components/splits/SplitsContractLink';
import ExternalInlineLink from 'components/links/ExternalInlineLink';
import Flex from 'components/base/Flex';
import Icon from 'components/Icon';

import SplitIcon from 'assets/icons/split-icon.svg';

import { ModalKey } from 'types/modal';
import { PercentSplitWithUsers } from 'types/Split';

interface SplitsModalProps {
  percentSplits: PercentSplitWithUsers;
}

const { className: modalStyles } = css({
  maxWidth: '540px !important',
})();

export default function SplitsModal(props: SplitsModalProps): JSX.Element {
  const { percentSplits } = props;

  return (
    <ModalContainer modalKey={ModalKey.ARTWORK_SPLITS}>
      <ModalContent className={modalStyles}>
        <ModalCloseButton />
        <Grid css={{ gap: '$8', paddingBottom: '$7' }}>
          <Grid css={{ gap: '$5' }}>
            <Flex css={{ alignItems: 'center' }}>
              <Icon icon={SplitIcon} width={36} height={31} top={3} />
              <Heading
                tracking="tight"
                leading="tight"
                css={{ fontSize: '$4', marginLeft: '$4' }}
              >
                Split
              </Heading>
            </Flex>

            <Paragraph css={{ maxWidth: 320 }}>
              Split Earnings are automatically deposited into each recipient’s
              wallet.{' '}
              <ExternalInlineLink href="https://help.foundation.app/en/articles/5305276-how-can-i-create-a-split-on-foundation">
                Learn more →
              </ExternalInlineLink>
            </Paragraph>
          </Grid>
          <SplitsBreakdown splits={percentSplits.shares} />
          <SplitsContractLink contractAddress={percentSplits.id} />
        </Grid>
      </ModalContent>
    </ModalContainer>
  );
}

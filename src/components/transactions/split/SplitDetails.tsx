/* eslint-disable react/jsx-max-depth */
import { useField, useFormikContext } from 'formik';
import { getIn } from 'formik';

import { css, styled } from 'stitches.config';

import Grid from 'components/base/Grid';
import Box from 'components/base/Box';
import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import Button from 'components/base/Button';
import Flex from 'components/base/Flex';
import Icon from 'components/Icon';
import Text from 'components/base/Text';

import SubmitButton from 'components/forms/SubmitButton';
import SplitSection from 'components/transactions/split/SplitSection';
import SplitUserSearch from 'components/forms/fields/SplitUserSearch';
import DisabledButton from 'components/forms/transactions/DisabledButton';

import SplitIcon from 'assets/icons/split-icon.svg';

import { MAX_SPLIT_RECIPIENT_COUNT } from 'lib/constants';

import type { MintFormValues } from 'components/transactions/mint/types';
import type { RevenueShare } from 'types/Share';

const SplitCount = styled(Text, {
  textAlign: 'right',
  fontFamily: '$body',
  color: '$black50',
  fontSize: '$1',
  fontWeight: 600,
});

interface SplitDetailsProps {
  publicAddress: string;
}

export default function SplitDetails(props: SplitDetailsProps): JSX.Element {
  const { publicAddress } = props;

  const [field] = useField<RevenueShare[]>('shares');

  const splitValues = field.value ?? [];
  const splitsCount = splitValues.length;

  return (
    <>
      <Grid css={{ gap: '$8' }}>
        <Grid css={{ gap: '$7' }}>
          <Heading
            tracking="tight"
            leading="tight"
            css={{ fontSize: '$4', maxWidth: 280 }}
          >
            Choose how your earnings are split
          </Heading>
          <Paragraph css={{ maxWidth: 480 }}>
            Primary sale earnings and royalty payments from secondary sales will
            be automatically deposited into each recipient’s wallet. Once your
            split contract is minted on the Ethereum blockchain, it cannot be
            updated or changed.
          </Paragraph>
        </Grid>

        <Grid css={{ gap: '$8' }}>
          <Box>
            <SplitUserSearch publicAddress={publicAddress} />
          </Box>

          <Grid css={{ gap: '$4' }}>
            <Flex
              css={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Flex css={{ alignItems: 'center', gap: '$3' }}>
                <Icon icon={SplitIcon} width={24} height={20} />
                <Heading
                  tracking="tight"
                  leading="tight"
                  css={{ fontSize: '$1' }}
                >
                  Edit Split
                </Heading>
              </Flex>
              {splitsCount > 1 && (
                <SplitCount>{`${splitsCount}/${MAX_SPLIT_RECIPIENT_COUNT}`}</SplitCount>
              )}
            </Flex>

            <SplitSection currentUserPublicAddress={publicAddress} />
          </Grid>
        </Grid>
      </Grid>

      <Box css={{ paddingTop: '$9' }}>
        <SplitDetailsSubmitButton />
      </Box>
    </>
  );
}

const { className } = css({ width: '100%' })();

function SplitDetailsSubmitButton(): JSX.Element {
  const { values, errors, isSubmitting } = useFormikContext<MintFormValues>();

  const isDraft = values.isDraft;

  const sharesErrors = getIn(errors, 'shares');

  const errorMessage =
    typeof errors.shares === 'string'
      ? errors.shares.toString()
      : 'Inputs not valid';
  // TODO: Handle the array case

  // try {
  //   errorMessage = errors.shares.toString();
  // } catch (e) {
  //   errorMessage = JSON.stringify(errors.shares);
  // }

  if (errors.shares) {
    // <DisabledButton>{errors.shares}</DisabledButton>;
    // TODO: (errors.shares is an object that can’t be rendered)
    // @gosseti What was the case where errors.shares was an object?
    return <DisabledButton>{errorMessage}</DisabledButton>;
  }

  // override the button to disable non-spinner
  // version when a draft is saving
  if (isDraft && isSubmitting) {
    return (
      <Button
        color="black"
        size="large"
        shape="regular"
        disabled
        css={{ width: '100%' }}
      >
        Mint NFT
      </Button>
    );
  }

  return (
    <SubmitButton className={className} disableIfInvalid>
      Mint NFT
    </SubmitButton>
  );
}

/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Button, Heading, Text } from 'theme-ui';
import { useField, useFormikContext } from 'formik';
import { Dispatch, SetStateAction } from 'react';

import TextField from 'components/forms/fields/TextField';
import TextAreaField from 'components/forms/fields/TextAreaField';
import SubmitButton from 'components/forms/SubmitButton';
import CharacterCounter from 'components/forms/CharacterCounter';
import SplitsToggle from 'components/transactions/split/SplitsToggle';

import { MintFormValues } from './types';

interface MintNFTDetailsInputProps {
  setIsReadyToConfigureSplit: Dispatch<SetStateAction<boolean>>;
  isReadyToConfigureSplit: boolean;
}

export default function MintNFTDetailsInput(
  props: MintNFTDetailsInputProps
): JSX.Element {
  const { setIsReadyToConfigureSplit, isReadyToConfigureSplit } = props;

  return (
    <>
      <Box>
        <Heading variant="h.m" sx={{ marginBottom: 'm' }}>
          Title and Description
        </Heading>
        <Text variant="body.body" sx={{ marginBottom: 'xl', maxWidth: 400 }}>
          Once your NFT is minted on the Ethereum blockchain, you will not be
          able to edit or update any of its information.
        </Text>
      </Box>

      <Grid>
        <Grid gap="m">
          <Box>
            <TextField placeholder="Title" name="name" />
            <CharacterCounter name="name" maxLength={50} />
          </Box>

          <Grid gap="xl">
            <Box>
              <TextAreaField
                placeholder="Description"
                name="description"
                rows={9}
              />
              <CharacterCounter name="description" maxLength={1000} />
            </Box>
            <SplitsToggle name="isUsingASplit" />
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ paddingTop: 'xl' }}>
        <MintNFTDetailsInputSubmitButton
          setIsReadyToConfigureSplit={setIsReadyToConfigureSplit}
          isReadyToConfigureSplit={isReadyToConfigureSplit}
        />
      </Box>
    </>
  );
}

interface MintNFTDetailsInputSubmitButtonProps {
  setIsReadyToConfigureSplit: Dispatch<SetStateAction<boolean>>;
  isReadyToConfigureSplit: boolean;
}

function MintNFTDetailsInputSubmitButton(
  props: MintNFTDetailsInputSubmitButtonProps
): JSX.Element {
  const { setIsReadyToConfigureSplit, isReadyToConfigureSplit } = props;

  const { isSubmitting, errors } = useFormikContext<MintFormValues>();

  const [field] = useField<boolean>('isUsingASplit');

  const isUsingASplit = field.value;

  // override the button to disable non-spinner
  // version when a draft is saving
  if (isSubmitting) {
    return (
      <Button disabled sx={{ width: '100%' }}>
        Mint NFT
      </Button>
    );
  }

  if (isUsingASplit && !isReadyToConfigureSplit) {
    return (
      <Button
        sx={{ width: '100%' }}
        disabled={Boolean(errors.name)}
        onClick={() => {
          setIsReadyToConfigureSplit(true);
        }}
      >
        Continue
      </Button>
    );
  }

  return (
    <SubmitButton sx={{ width: '100%' }} disableIfInvalid>
      Mint NFT
    </SubmitButton>
  );
}

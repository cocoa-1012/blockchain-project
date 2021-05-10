import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { useField, useFormikContext } from 'formik';
import { endsWith, length, slice } from 'ramda';
import { InputActionMeta } from 'react-select';
import { useState } from 'react';

import customStyles from './customStyles';

import Box from 'components/base/Box';
import Button from 'components/base/Button';
import Link from 'components/links/Link';
import Grid from 'components/base/Grid';
import FieldHint from 'components/forms/fields/FieldHint';
import FormikSubmitButton from 'components/forms/FormikSubmitButton';

import { ListArtworkPath } from '../mint/types';
import { Option } from './types';
import { notEmptyOrNil } from 'utils/helpers';

export const formatTagOptions = (options: string[]) =>
  options.map((value) => ({
    label: value,
    value,
  }));
interface TagsTextareaProps {
  options: Option[];
  listArtworkPath: string | ListArtworkPath;
  name: string;
  isInCreatorFlow: boolean;
}

export default function TagsTextarea(props: TagsTextareaProps): JSX.Element {
  const { options, listArtworkPath, name, isInCreatorFlow } = props;

  const [field, , helpers] = useField<string[]>(name);
  const [inputValue, setInputValue] = useState('');
  const { errors } = useFormikContext();

  const selectedOptions = formatTagOptions(field.value);
  const selectedOptionsCount = length(selectedOptions);
  const limitReached = selectedOptionsCount > 10;
  const noOptionsSelected = selectedOptionsCount === 0;
  const isSkippable = noOptionsSelected && isInCreatorFlow;

  const noOptionsMessage = () => {
    return 'Duplicate tags not accepted';
  };

  const handleChange = (newValue: Option[]) => {
    helpers.setValue(
      newValue.map((option) => option.value.toLowerCase().trim())
    );
    setInputValue('');
  };

  const onInputChange = (inputValue: string, { action }: InputActionMeta) => {
    const endsWithComma = endsWith(',', inputValue);
    const inputChangeEvent = action === 'input-change';

    if (inputChangeEvent && endsWithComma) {
      const label = slice(0, -1, inputValue);
      handleChange([...formatTagOptions(field.value), { label, value: label }]);
      setInputValue('');
    } else if (inputChangeEvent) {
      setInputValue(inputValue);
    }
  };

  return (
    <Grid css={{ gap: '$7' }}>
      <Grid
        css={{
          gap: '$3',
          '#input-wrapper input': {
            // workaround bc styles on input within ./customStyles not applied
            fontFamily: '$body',
          },
        }}
      >
        <Box
          id="input-wrapper"
          css={{
            border: limitReached ? '1px solid $red100' : 'unset',
            borderRadius: '$1',
          }}
        >
          <CreatableSelect
            maxMenuHeight={160}
            noOptionsMessage={noOptionsMessage}
            onInputChange={onInputChange}
            onChange={handleChange}
            inputValue={inputValue}
            value={selectedOptions}
            options={options}
            isMulti
            styles={customStyles}
            placeholder="Add tags…"
          />
        </Box>

        {limitReached && (
          <FieldHint type="warning">
            A maximum of 10 tags can be added to an NFT.
          </FieldHint>
        )}
        {notEmptyOrNil(errors) && (
          <FieldHint type="warning">Duplicate tags not accepted</FieldHint>
        )}
      </Grid>

      {isSkippable ? (
        <Link href={listArtworkPath}>
          <Button
            color="white"
            size="large"
            shape="regular"
            type="button"
            css={{ width: '100%' }}
            as="a"
          >
            Skip for now
          </Button>
        </Link>
      ) : (
        <FormikSubmitButton
          label={isInCreatorFlow ? 'Continue' : 'Save'}
          submittingLabel="Saving tags…"
          submittedLabel="Tags saved!"
        />
      )}
    </Grid>
  );
}

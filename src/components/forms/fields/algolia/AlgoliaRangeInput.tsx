import { connectRange } from 'react-instantsearch-dom';
import { useCallback, useState } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { compose, map, prop, sum, filter } from 'ramda';

import { styled } from 'stitches.config';

import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Button from 'components/base/Button';
import Text from 'components/base/Text';
import Icon from 'components/Icon';
import PriceField from 'components/forms/fields/PriceField';

import { formatETHWithSuffix, formatInteger } from 'utils/formatters';
import { isAllTrue } from 'utils/helpers';

import { SearchSchema } from 'schemas/search';

import CloseIcon from 'assets/icons/close-icon.svg';

type StringOrNumber = string | number;

interface RangeValues {
  min: StringOrNumber;
  max: StringOrNumber;
}

type Count = {
  count: number;
  value: string;
};

const sumCounts = (min: StringOrNumber, max: StringOrNumber) =>
  compose<Count[], Count[], number[], number>(
    sum,
    map(prop('count')),
    filter((count: Count) => {
      const value = Number(count.value);
      return value >= min && value <= max;
    })
  );

const AlgoliaRangeInput = connectRange((props) => {
  const { min, max, refine, count, currentRefinement, hasSearchValue } = props;

  const [isLocked, setIsLocked] = useState(hasSearchValue);

  const handleSubmit = useCallback(
    (values: RangeValues) => {
      refine(values);
      setIsLocked(true);
    },
    [refine]
  );

  const clearField = useCallback(() => {
    refine({
      min: '',
      max: '',
    });
    setIsLocked(false);
  }, [refine, setIsLocked]);

  const minMaxLoading = isAllTrue([!min, !max]);

  if (minMaxLoading) {
    return null;
  }

  return (
    <Formik<RangeValues>
      validationSchema={SearchSchema(min, max)}
      initialValues={{
        min: (hasSearchValue && currentRefinement?.min) ?? '',
        max: (hasSearchValue && currentRefinement?.max) ?? '',
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        {isLocked ? (
          <RemovePriceAction clearField={clearField} resultCounts={count} />
        ) : (
          <PriceFormFields />
        )}
      </Form>
    </Formik>
  );
});

const RemovePriceIcon = styled(Box, {
  color: '$black20',
  marginLeft: '$6',
  cursor: 'pointer',
  '@media (hover: hover)': {
    '&:hover': {
      color: '$black100',
    },
  },
});

const RemovePriceContainer = styled(Flex, {
  backgroundColor: '$black5',
  minHeight: 60,
  alignItems: 'center',
  paddingLeft: '$5',
  paddingRight: '$6',
  borderRadius: '$2',
  justifyContent: 'space-between',
});

function PriceFormFields(): JSX.Element {
  const { isValid } = useFormikContext<RangeValues>();

  return (
    <Grid css={{ gap: '$4' }}>
      <Grid css={{ gridTemplateColumns: '1fr 1fr', gap: '$3' }}>
        <PriceField name="min" placeholder="0.00" />
        <PriceField name="max" placeholder="0.00" />
      </Grid>
      <Flex css={{ cursor: isValid ? 'inherit' : 'not-allowed' }}>
        <Button
          color="white"
          type="submit"
          size="large"
          shape="regular"
          disabled={!isValid}
          css={{
            width: '100%',
            opacity: isValid ? 1 : 0.3,
          }}
        >
          Set price
        </Button>
      </Flex>
    </Grid>
  );
}

interface RemovePriceActionProps {
  clearField: () => void;
  resultCounts: Count[];
}

function RemovePriceAction(props: RemovePriceActionProps): JSX.Element {
  const { clearField, resultCounts } = props;

  const { values, resetForm } = useFormikContext<RangeValues>();

  const resultsCount = sumCounts(values.min, values.max)(resultCounts);

  return (
    <RemovePriceContainer
      onClick={() => {
        clearField();
        resetForm();
      }}
      css={{
        cursor: 'pointer',
        '@media (hover: hover)': {
          [`&:hover ${RemovePriceIcon}`]: {
            color: '$black100',
          },
        },
      }}
    >
      <Box css={{ fontWeight: 600, fontFamily: '$body' }}>
        {formatETHWithSuffix(values.min)} – {formatETHWithSuffix(values.max)}
      </Box>
      <Flex css={{ alignItems: 'center' }}>
        <Text css={{ fontWeight: 400, fontFamily: '$body', color: '$black50' }}>
          {formatInteger(resultsCount)}
        </Text>
        <RemovePriceIcon onClick={clearField}>
          <Icon icon={CloseIcon} width={10} height={10} />
        </RemovePriceIcon>
      </Flex>
    </RemovePriceContainer>
  );
}

export default AlgoliaRangeInput;

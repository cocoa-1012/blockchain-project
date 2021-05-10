import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { AnimatePresence } from 'framer-motion';

import Button from 'components/base/Button';
import SpinnerStroked from 'components/SpinnerStroked';
import Box from 'components/base/Box';
import ComponentTransition from 'components/ComponentTransition';

interface FormikSubmitButtonProps {
  label: string;
  submittingLabel: string;
  submittedLabel: string;
  disabled?: boolean;
}

export default function FormikSubmitButton(
  props: FormikSubmitButtonProps
): JSX.Element {
  const { label, submittingLabel, submittedLabel, disabled } = props;
  const { isSubmitting, handleSubmit, isValid, status } = useFormikContext();
  const [isSubmitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (status?.formSubmitted && isValid) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 10000);
    }
  }, [isValid, status]);

  const isDisabled = isSubmitting || isSubmitted || !isValid || disabled;

  const displayLabel = isSubmitting
    ? submittingLabel
    : isSubmitted
    ? submittedLabel
    : label;

  return (
    <Button
      type="submit"
      onClick={() => handleSubmit()}
      disabled={isDisabled}
      color={disabled ? 'gray' : 'black'}
      size="large"
      shape="regular"
      css={{
        width: '100%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
      }}
    >
      {isSubmitting && (
        <Box
          css={{
            position: 'absolute',
            left: '$5',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <SpinnerStroked size={20} />
        </Box>
      )}
      <AnimatePresence exitBeforeEnter>
        <ComponentTransition key={displayLabel}>
          {displayLabel}
        </ComponentTransition>
      </AnimatePresence>
    </Button>
  );
}

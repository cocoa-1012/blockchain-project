import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'theme-ui';
import { useFormikContext } from 'formik';
import LoadingButton from 'components/buttons/LoadingButton';

const buttonPropTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  variant: PropTypes.string.isRequired,
  loadingVariant: PropTypes.string,
  submittingText: PropTypes.string,
  disableIfInvalid: PropTypes.bool,
  isLoading: PropTypes.bool,
  component: PropTypes.any,
};

SubmitButton.propTypes = buttonPropTypes;

SubmitButton.defaultProps = {
  variant: 'primary',
  loadingVariant: 'loading',
  disableIfInvalid: false,
  isLoading: false,
  component: LoadingButton,
};

export default function SubmitButton(props) {
  const {
    children,
    className,
    variant,
    loadingVariant,
    submittingText,
    disableIfInvalid,
    isLoading,
    component: Component,
  } = props;

  const { isSubmitting, isValid, isInitialValid } = useFormikContext();

  const disabled =
    isLoading ||
    isSubmitting ||
    (disableIfInvalid && !isValid && !isInitialValid);

  const loading = isLoading || isSubmitting;

  return (
    <Component
      // provide a different style variant to
      // the button when it’s loading
      variant={loading ? loadingVariant : variant}
      isLoading={loading}
      disabled={disabled}
      className={className}
      type="submit"
    >
      {isSubmitting && submittingText ? submittingText : children ?? 'Submit'}
    </Component>
  );
}

SubmitButtonSmall.propTypes = buttonPropTypes;

SubmitButtonSmall.defaultProps = {
  variant: 'small',
  loadingVariant: 'small',
  disableIfInvalid: false,
  isLoading: false,
};

export function SubmitButtonSmall(props) {
  return <SubmitButton {...props} component={Button} />;
}

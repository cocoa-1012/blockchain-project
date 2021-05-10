import { useField, useFormikContext } from 'formik';
import { useCallback, useEffect } from 'react';

import { MintFormValues } from 'components/transactions/mint/types';
import { noop } from 'utils/helpers';

interface SaveDraftArtwork {
  saveAsDraft: () => void;
  isSubmitting: boolean;
  isDraft: boolean;
}

interface UseSaveDraftArtworkArgs {
  onCompleted: () => void;
}

export default function useSaveDraftArtwork(
  props: UseSaveDraftArtworkArgs
): SaveDraftArtwork {
  const { onCompleted = noop } = props;

  const [field, , helpers] = useField('isDraft');

  const { submitForm, isSubmitting } = useFormikContext<MintFormValues>();

  const saveAsDraft = useCallback(async () => {
    helpers.setValue(true);
    // https://github.com/formium/formik/issues/529#issuecomment-400832225
    await Promise.resolve();
    await submitForm();
    helpers.setValue(false);
    onCompleted();
  }, [helpers, submitForm, onCompleted]);

  return {
    saveAsDraft,
    isSubmitting,
    isDraft: field.value,
  };
}

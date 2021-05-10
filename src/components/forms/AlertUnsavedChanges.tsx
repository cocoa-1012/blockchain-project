import { useFormikContext } from 'formik';
import { useBeforeUnload } from 'react-use';

export default function AlertUnsavedChanges(): null {
  const { dirty } = useFormikContext();

  useBeforeUnload(dirty, 'You have an unsaved draft, are you sure?');

  return null;
}

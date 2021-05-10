import { useField } from 'formik';
import { isEmptyOrNil } from 'utils/helpers';

import HintText from 'components/forms/fields/HintText';
import SuccessField from 'components/forms/fields/SuccessField';

interface UsernameAvailableProps {
  name: string;
}

export default function UsernameAvailable(
  props: UsernameAvailableProps
): JSX.Element {
  const { name } = props;
  const [field, meta] = useField(name);

  const noValue = isEmptyOrNil(field.value);

  if (noValue) {
    return null;
  }

  if (meta.error) {
    return (
      <HintText bg="red.10" color="red.100">
        Username {field.value} is already taken
      </HintText>
    );
  }
  return <SuccessField>Username {field.value} is available</SuccessField>;
}

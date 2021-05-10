import { useField } from 'formik';
import { styled } from 'stitches.config';

import BlockCheckbox from 'components/forms/fields/BlockCheckbox';

import Label from 'components/forms/Label';
import Text from 'components/base/Text';
import Box from 'components/base/Box';

const Sub = styled(Text, {
  color: '$black60',
  fontSize: '$0',
  fontWeight: 400,
  lineHeight: 1.6,
});

interface CheckboxAndWrapperProps {
  name: string;
  label: string;
  description: string;
}

export default function CheckboxAndWrapper(
  props: CheckboxAndWrapperProps
): JSX.Element {
  const { label, name, description } = props;
  const [field, , helpers] = useField<boolean>({ name, type: 'checkbox' });

  return (
    <BlockCheckbox
      name={label}
      checked={field.checked}
      onCheckedChange={(isChecked) => helpers.setValue(isChecked)}
    >
      <Box css={{ marginLeft: '$5', '@bp1': { marginLeft: '$7' } }}>
        <Label
          css={{ fontSize: '$2', marginBottom: '$2', display: 'block' }}
          htmlFor={label}
        >
          {label}
        </Label>
        <Sub>{description}</Sub>
      </Box>
    </BlockCheckbox>
  );
}

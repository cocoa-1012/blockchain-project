import { useField } from 'formik';
import { styled } from 'stitches.config';

import BlockCheckbox from 'components/forms/fields/BlockCheckbox';
import Label from 'components/forms/Label';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import Flex from 'components/base/Flex';
import UserTagDynamic from 'components/users/UserTagDynamic';
import FollowPopover from 'components/follows/FollowPopover';
import ErrorField from 'components/forms/fields/ErrorField';

const Sub = styled(Text, {
  color: '$black100',
  fontSize: '$1',
  fontWeight: 400,
  lineHeight: 1.6,
});

interface NewsletterSettingProps {
  label: string;
  description: string;
  publicKey: string;
  name: string;
}

export default function NewsletterSetting(
  props: NewsletterSettingProps
): JSX.Element {
  const { label, description, name, publicKey } = props;

  const [field, meta, helpers] = useField<boolean>({ name, type: 'checkbox' });

  return (
    <BlockCheckbox
      name={label}
      checked={field.checked}
      onCheckedChange={(isChecked) => helpers.setValue(isChecked)}
      css={{ display: 'block' }}
    >
      <Box css={{ marginLeft: '$9', '@bp1': { marginLeft: '$7' } }}>
        <Label
          css={{
            fontSize: '$2',
            marginBottom: '$2',
            display: 'block',
            lineHeight: 1,
            '@bp1': {
              marginLeft: '$6',
              marginBottom: '$6',
              fontSize: '$4',
            },
          }}
          htmlFor={label}
        >
          {label}
        </Label>
        <Sub css={{ display: 'block', '@bp1': { display: 'none' } }}>
          {description}
        </Sub>
      </Box>

      <Sub css={{ display: 'none', '@bp1': { display: 'block' } }}>
        {description}
      </Sub>
      <Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '$6',
          '@bp1': {
            justifyContent: 'flex-start',
          },
        }}
      >
        <Text css={{ fontWeight: 600, marginRight: '$5' }}>Written by</Text>
        <Flex>
          <FollowPopover publicKey={publicKey}>
            <UserTagDynamic publicKey={publicKey} />
          </FollowPopover>
        </Flex>
      </Flex>
      <ErrorField meta={meta} />
    </BlockCheckbox>
  );
}

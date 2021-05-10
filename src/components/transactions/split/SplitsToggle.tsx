import Toggle from 'react-toggle';
import { useField } from 'formik';

import Flex from 'components/base/Flex';
import Grid from 'components/base/Grid';
import Heading from 'components/base/Heading';
import Paragraph from 'components/base/Paragraph';
import Icon from 'components/Icon';

import SplitIcon from 'assets/icons/split-icon.svg';

interface SplitsToggleProps {
  name: string;
}

export default function SplitsToggle(props: SplitsToggleProps): JSX.Element {
  const { name } = props;

  const [field] = useField(name);

  return (
    <Grid css={{ gap: '$5' }}>
      <Flex css={{ justifyContent: 'space-between' }}>
        <Flex css={{ alignItems: 'center', gap: '$4' }}>
          <Icon icon={SplitIcon} width={26} height={24} />
          <Heading tracking="tight" leading="tight" css={{ fontSize: '$3' }}>
            Create a Split
          </Heading>
        </Flex>

        <Toggle {...field} value={name} checked={field.value} />
      </Flex>
      <Paragraph size="sub" css={{ maxWidth: 360 }}>
        Enable a Split to automatically divide any funds or royalties earned
        from this NFT with up to four recipients, including yourself.
      </Paragraph>
    </Grid>
  );
}

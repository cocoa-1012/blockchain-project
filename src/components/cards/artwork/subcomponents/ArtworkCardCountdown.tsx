import Box from 'components/base/Box';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';

import { CountdownPart } from 'hooks/use-countdown';

interface ArtworkCardCountdownProps {
  formattedParts: CountdownPart[];
}

export default function ArtworkCardCountdown(
  props: ArtworkCardCountdownProps
): JSX.Element {
  const { formattedParts } = props;
  return (
    <Flex>
      {formattedParts.map(({ label, shortLabel, value }) => (
        <Box key={label} css={{ marginRight: '$2' }}>
          <Text css={{ fontSize: '$2', fontWeight: 600, fontFamily: '$body' }}>
            {value}
            {shortLabel}
          </Text>
        </Box>
      ))}
    </Flex>
  );
}

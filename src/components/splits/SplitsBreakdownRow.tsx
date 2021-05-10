import { styled } from 'stitches.config';
import { motion } from 'framer-motion';

import Grid from 'components/base/Grid';
import Flex from 'components/base/Flex';
import UserTag from 'components/users/UserTag';
import Text from 'components/base/Text';
import Box from 'components/base/Box';

import { ShareWithUser } from 'types/Split';

const ANIMATION_DURATION = 0.15;

interface SplitsBreakdownRowProps {
  split: ShareWithUser;
  index: number;
}

export default function SplitsBreakdownRow(
  props: SplitsBreakdownRowProps
): JSX.Element {
  const { split, index } = props;

  const sharePercentage = `${split.shareInPercent}%`;

  return (
    <Grid css={{ gap: '$6' }}>
      <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <UserTag user={split.user} />
        <Text css={{ fontSize: '$3', fontWeight: 600, fontFamily: '$body' }}>
          {sharePercentage}
        </Text>
      </Flex>
      <ProgressBarContainer>
        <ProgressBar
          as={motion.div}
          initial={{ width: 0 }}
          animate={{ width: sharePercentage }}
          transition={{ delay: (index + 1) * ANIMATION_DURATION }}
        />
      </ProgressBarContainer>
    </Grid>
  );
}

// TODO: move these into a separate component
const ProgressBar = styled(Box, {
  background:
    'linear-gradient(110.78deg, #76E650 -1.13%, #F9D649 15.22%, #F08E35 32.09%, #EC5157 48.96%, #FF18BD 67.94%, #1A4BFF 85.34%, #62D8F9 99.57%)',
  height: 4,
  borderRadius: '$round',
});

const ProgressBarContainer = styled(Box, {
  height: 4,
  display: 'grid',
  gridTemplateRows: '1fr',
  backgroundColor: '$black10',
  borderRadius: '$round',
});

/* eslint-disable react/jsx-max-depth */
import { BasicArtwork } from 'types/Artwork';

import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import Icon from 'components/Icon';
import Grid from 'components/base/Grid';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import Paragraph from 'components/base/Paragraph';
import ExternalLink from 'components/links/ExternalLink';

import DMCAIcon from 'assets/icons/dmca-icon.svg';
import Body from 'components/base/Body';

interface ArtworkDMCANoticeProps {
  artwork: BasicArtwork;
}

const NoticeContainer = styled(Flex, {
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 480,
  marginX: 'auto',
  flex: 1,
});

const NoticeHeading = styled(Text, {
  fontSize: '$3',
  letterSpacing: '-0.02em',
  fontWeight: 600,
  fontFamily: '$body',
  textAlign: 'center',
  '@bp1': {
    fontSize: '$4',
  },
});

const NoticeText = styled(Paragraph, {
  marginX: 'auto',
  textAlign: 'center',
});

const NoticeIssuedBy = styled(Box, {
  backgroundColor: '$black10',
  paddingX: '$3',
  paddingY: '$2',
  fontFamily: '$body',
  fontWeight: 600,
  borderRadius: '$2',
});

export default function ArtworkDMCANotice(
  props: ArtworkDMCANoticeProps
): JSX.Element {
  const { artwork } = props;
  return (
    <Body css={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <NoticeContainer>
        <Grid css={{ gap: '$5' }}>
          <Grid css={{ gap: '$7', justifyContent: 'center' }}>
            <Box css={{ marginX: 'auto' }}>
              <Icon icon={DMCAIcon} width={48} height={48} />
            </Box>

            <NoticeHeading>
              This artwork has received a DMCA takedown notice.
            </NoticeHeading>
          </Grid>
          <Grid css={{ gap: '$7' }}>
            <Grid css={{ gap: '$4' }}>
              <NoticeText>Complaint submitted by</NoticeText>

              <NoticeIssuedBy css={{ marginX: 'auto' }}>
                {artwork?.moderationFrom}
              </NoticeIssuedBy>
            </Grid>
            <Flex css={{ justifyContent: 'center' }}>
              <ExternalLink href="https://help.foundation.app/en/articles/5151857-guide-digital-millennium-copyright-act-or-dmca">
                Learn about the DMCA process →
              </ExternalLink>
            </Flex>
          </Grid>
        </Grid>
      </NoticeContainer>
    </Body>
  );
}

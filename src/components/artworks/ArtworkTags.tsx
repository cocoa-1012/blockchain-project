import { styled } from 'stitches.config';

import Tag from 'components/transactions/tags/Tag';
import Text from 'components/base/Text';
import Flex from 'components/base/Flex';
import Link from 'components/links/Link';
import Grid from 'components/base/Grid';
import InternalLink from 'components/links/InternalLink';

import { BasicArtwork } from 'types/Artwork';

export const Description = styled(Text, {
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$1',
});

const LinkedTag = styled(Tag, {
  cursor: 'pointer',
  transition: 'transform $1 $ease',
  willChange: 'transform',
  '@media (hover: hover)': {
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
});

interface ArtworkTagProps {
  tags: string[];
  isCurrentUserProfile: boolean;
  artwork: BasicArtwork;
}

export default function ArtworkTags(props: ArtworkTagProps): JSX.Element {
  const { tags, isCurrentUserProfile, artwork } = props;

  return (
    <Grid css={{ gap: '$5' }}>
      <Description>Tags</Description>
      <Flex css={{ flexWrap: 'wrap', maxWidth: 350 }}>
        {tags.map((tag: string) => (
          <Link
            key={tag}
            href={{
              pathname: '/tags',
              query: {
                tags: [tag],
              },
            }}
          >
            <a style={{ textDecoration: 'none', color: 'inherit' }}>
              <LinkedTag key={tag}>{tag}</LinkedTag>
            </a>
          </Link>
        ))}
      </Flex>
      {isCurrentUserProfile && (
        <Flex css={{ display: 'none', '@bp1': { display: 'block' } }}>
          <InternalLink href={`/creator/${artwork?.id}/tags?redirect=profile`}>
            Edit tags
          </InternalLink>
        </Flex>
      )}
    </Grid>
  );
}

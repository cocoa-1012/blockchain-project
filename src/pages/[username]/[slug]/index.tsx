import { isNil } from 'ramda';
import dynamic from 'next/dynamic';
import { GetStaticPathsResult } from 'next';

import Flex from 'components/base/Flex';
import Page from 'components/Page';
import ArtworkPage from 'components/artworks/ArtworkPage';
import GenericError from 'components/GenericError';

import renderArtworkWarningPageBlock from 'components/trust-safety/ArtworkWarningPageBlock';
import renderProfileWarningBlock from 'components/trust-safety/ProfileWarningBlock';

const ModerationBanner = dynamic(
  () => import('components/admin/ModerationBanner')
);

const ChangeStatusAdminModal = dynamic(
  () => import('components/modals/ChangeStatusAdminModal')
);

const ReportModal = dynamic(() => import('components/modals/ReportModal'));

import useAuthToken from 'hooks/queries/use-auth-token';
import useUserByPublicKey from 'hooks/queries/use-user-by-public-key';
import useAddUsernamePrefix from 'hooks/use-add-username-prefix';
import useSocialVerifications from 'hooks/queries/hasura/use-social-verifications';

import { buildPageShareUrl, buildPosterUrl } from 'utils/assets';
import { truncateMetaDescription } from 'utils/helpers';
import { isFlaggedForModeration } from 'utils/moderation';
import { getTwitterUsername } from 'utils/twitter-templates';

import {
  getArtworkPageProps,
  useProfileArtworkByTokenId,
} from 'queries/server/artwork-page';
import { setArtworkModerationProxy } from 'queries/admin/artwork';

import { BasicArtwork } from 'types/Artwork';
import { ReportType } from 'types/Report';
import { PercentSplitWithUsers } from 'types/Split';
import { maybeToString } from 'utils/strings';

interface ArtworkIndexPageProps {
  artwork: BasicArtwork;
  percentSplits: PercentSplitWithUsers;
}

export default function ArtworkIndexPage(
  props: ArtworkIndexPageProps
): JSX.Element {
  const { artwork: initialArtworkData, percentSplits } = props;

  // If the username is missing the @ prefix add it into the url
  useAddUsernamePrefix();

  const { user } = useAuthToken();

  const tokenId = maybeToString(initialArtworkData?.tokenId);

  const { data: artwork } = useProfileArtworkByTokenId(
    { tokenId },
    {
      initialData: initialArtworkData,
      refetchOnWindowFocus: false,
      enabled: Boolean(tokenId),
    }
  );

  const { data: currentUserData } = useUserByPublicKey({
    publicKey: user?.publicAddress,
    refetchOnWindowFocus: false,
  });

  const { data: socialVerificationData } = useSocialVerifications({
    publicKey: artwork?.creator?.publicKey,
  });

  const authToken = user?.token;

  const currentUserIsAdmin = currentUserData?.user?.isAdmin;

  const noArtwork = isNil(artwork);

  if (noArtwork) {
    return <GenericError />;
  }

  const { name, description, tags } = artwork;

  const openGraphAsset: string = buildPageShareUrl(artwork);
  const posterUrl: string = buildPosterUrl(artwork, { bg: 'F2F2F2' });

  const truncatedDescription = truncateMetaDescription(description);

  const creatorModerationStatus = artwork?.creator?.moderationStatus;
  const isCreatorModerated = isFlaggedForModeration(creatorModerationStatus);

  if (isCreatorModerated && !currentUserIsAdmin) {
    return renderProfileWarningBlock(creatorModerationStatus);
  }

  const artworkModerationStatus = artwork?.moderationStatus;
  const isArtworkModerated = isFlaggedForModeration(artworkModerationStatus);

  if (isArtworkModerated && !currentUserIsAdmin) {
    return renderArtworkWarningPageBlock(artwork);
  }

  return (
    <>
      {isArtworkModerated && currentUserIsAdmin && (
        <ModerationBanner
          status={artworkModerationStatus}
          reviewText="This artwork is under review."
          suspendedText="This artwork has been removed."
          takedownText={`This artwork has received a DMCA takedown notice from ${artwork.moderationFrom}.`}
        />
      )}
      {/* checking we have tokenId (as in preview mode it’s not present) */}
      {Boolean(currentUserIsAdmin && tokenId) && (
        <ChangeStatusAdminModal
          moderationStatus={artworkModerationStatus}
          moderationFrom={artwork?.moderationFrom}
          currentUserPublicAddress={user?.publicAddress}
          authToken={authToken}
          entityId={artwork?.id}
          tokenId={tokenId.toString()}
          mutation={setArtworkModerationProxy}
          dmcaEnabled={true}
        />
      )}

      {tokenId && (
        <ReportModal
          publicAddress={user?.publicAddress}
          authToken={authToken}
          id={tokenId.toString()}
          type={ReportType.Artwork}
        />
      )}

      <Flex
        css={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Page
          title={name}
          description={truncatedDescription}
          image={posterUrl ?? openGraphAsset}
          absolute
        >
          <ArtworkPage
            artwork={artwork}
            tags={tags}
            user={user}
            percentSplits={percentSplits}
            currentUserPublicKey={user?.publicAddress}
            twitterUsername={getTwitterUsername(socialVerificationData)}
          />
        </Page>
      </Flex>
    </>
  );
}

type PageArgs = { slug: string };
type PageProps = GetStaticPathsResult<PageArgs>;

export async function getStaticPaths(): Promise<PageProps> {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export const getStaticProps = getArtworkPageProps;

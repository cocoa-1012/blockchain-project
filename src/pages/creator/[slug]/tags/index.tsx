import { any } from 'ramda';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import useAuthToken from 'hooks/queries/use-auth-token';
import useUserModerationState from 'hooks/queries/hasura/use-user-moderation-state';

import { useSuggestedTags } from 'graphql/server/queries/suggested-tags.generated';
import useNavigationProgress from 'hooks/use-navigation-progress';
import { useArtworkByUuid } from 'graphql/hasura/queries/artwork-by-uuid.generated';
import useNavigationFlowState from 'state/stores/navigation-flow';

import { WrappedTransactionLayout } from 'components/layouts/TransactionLayout';
import TransactionModerationGuard from 'components/trust-safety/TransactionModerationGuard';
import TransactionLoadingPage from 'components/transactions/TransactionLoadingPage';
import WalletAuthBlock from 'components/auth/WalletAuthBlock';
import TagsTransaction from 'components/transactions/tags/TagsTransaction';
import { formatTagOptions } from 'components/transactions/tags/TagsTextarea';

import {
  CreatorFlowStep,
  creatorFlowSteps,
} from 'components/transactions/navigationFlows';

import {
  buildArtworkPath,
  buildCreatorArtworkPath,
} from 'utils/artwork/artwork';
import { getFirstValue, notEmptyOrNil } from 'utils/helpers';

Tags.getLayout = WrappedTransactionLayout({
  title: 'Tags',
  percentCompleted: 63.5,
  navigationSteps: creatorFlowSteps,
  bodyClass: 'creator-flow',
});

export default function Tags(): JSX.Element {
  const router = useRouter();

  const artworkUuid = getFirstValue(router.query.slug);

  useNavigationProgress({
    percentCompleted: 63.5,
    activeStep: CreatorFlowStep.Tags,
  });

  const { user, isLoading: isUserLoading } = useAuthToken();

  const { setProgressBarEnabled } = useNavigationFlowState((state) => state);

  const { data: suggestedTags } = useSuggestedTags();

  const options = formatTagOptions(suggestedTags?.getSuggestedTags ?? []);

  const publicAddress = user?.publicAddress;

  const { data: artworkData, isLoading: isServerArtworkLoading } =
    useArtworkByUuid({ id: artworkUuid }, { enabled: Boolean(artworkUuid) });

  const artwork = artworkData?.artwork;
  const tags = artwork?.tags;
  const hasTags = notEmptyOrNil(tags);

  const {
    isUserModerated,
    isLoading: isModerationStateLoading,
    moderationStatus,
  } = useUserModerationState(publicAddress);

  const loadingStates = [
    isUserLoading,
    isServerArtworkLoading,
    isModerationStateLoading,
  ];

  const isLoading = any(Boolean, loadingStates);

  const creatorArtworkPath = buildCreatorArtworkPath(artwork);

  const isInCreatorFlow = !router.query.redirect;
  const progressBarEnabled = isInCreatorFlow;

  useEffect(() => {
    setProgressBarEnabled(progressBarEnabled);
    return () => setProgressBarEnabled(true);
  }, [progressBarEnabled, setProgressBarEnabled]);

  const artworkPath = buildArtworkPath({ artwork, user: artwork?.creator });
  const listArtworkPath = `${creatorArtworkPath}/list`;

  if (isLoading) {
    return <TransactionLoadingPage />;
  }

  if (!user) {
    return <WalletAuthBlock />;
  }

  if (isUserModerated) {
    return <TransactionModerationGuard moderationStatus={moderationStatus} />;
  }

  return (
    <TagsTransaction
      isInCreatorFlow={isInCreatorFlow}
      title={hasTags ? 'Edit tags' : 'Add tags'}
      artwork={artwork}
      // if coming via the profile we redirect back there
      listArtworkPath={isInCreatorFlow ? listArtworkPath : artworkPath}
      options={options}
    />
  );
}

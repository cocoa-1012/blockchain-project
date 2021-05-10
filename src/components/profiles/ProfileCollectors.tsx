import {
  propOr,
  compose,
  flatten,
  path,
  take,
  sortWith,
  descend,
  length,
  uniqBy,
} from 'ramda';
import { InfiniteData } from 'react-query';

import { styled } from 'stitches.config';

import Flex from 'components/base/Flex';
import Text from 'components/base/Text';
import Box from 'components/base/Box';
import { UserStackInteractive } from 'components/follows/UserStack';

import useProfileCollectors from 'hooks/queries/subgraph/use-profile-collectors';

import { ModalKey } from 'types/modal';
import { Collector } from 'types/Account';

import { isEmptyOrNil } from 'utils/helpers';

import useModal from 'hooks/use-modal';

const CollectorsPill = styled(Flex, {
  backgroundColor: '$white100',
  boxShadow: '$0',
  borderRadius: '$round',
  paddingX: '$5',
  paddingY: '$3',
  alignItems: 'center',
  position: 'relative',
  transition: 'box-shadow $1 $ease',
  '@media (hover: hover)': {
    '&:hover': {
      boxShadow: '$1',
    },
  },
});

const CollectorsHeading = styled(Text, {
  fontFamily: '$body',
  fontSize: '$body',
  fontWeight: 600,
});

const ViewAllButton = styled(CollectorsHeading, {
  position: 'relative',
  zIndex: 2,
  marginLeft: '$5',
  color: '$black50',
  cursor: 'pointer',
  transition: 'color $1 $ease',
  display: 'none',
  '@bp1': {
    display: 'block',
  },
  '@media (hover: hover)': {
    '&:hover': {
      color: '$black100',
    },
  },
});

const getFirstAuctionEnd = path(['highestBidAuctions', 0, 'endsAt']);

const getAuctionCount = path([
  'highestBidAuctions_aggregate',
  'aggregate',
  'count',
]);

const getCollectors = compose<
  InfiniteData<Collector[]>,
  Collector[][],
  Collector[],
  Collector[],
  Collector[]
>(
  uniqBy((c) => c.publicKey),
  // sort by number of won auctions and then auction end date
  sortWith([descend(getAuctionCount), descend(getFirstAuctionEnd)]),
  // flatten the data structure
  flatten,
  // get the pages data
  propOr([], 'pages')
);
interface ProfileCollectorsProps {
  publicKey: string;
  currentUserPublicKey: string;
  initialData: InfiniteData<Collector[]>;
}

export default function ProfileCollectors(
  props: ProfileCollectorsProps
): JSX.Element {
  const { publicKey, initialData } = props;

  const { data: topCollectorsData, isError } = useProfileCollectors({
    publicKey,
    currentUserPublicKey: publicKey,
    limit: 100,
    initialData,
  });

  const { setCurrentModal } = useModal();

  const topCollectors = getCollectors(topCollectorsData);

  const topFiveCollectors = take(5, topCollectors);

  const openCollectorsModal = () => {
    setCurrentModal(ModalKey.COLLECTORS);
  };

  const hasNoCollectors = isEmptyOrNil(topFiveCollectors);

  const hasMoreCollectors = length(topCollectors) > 5;

  if (hasNoCollectors || isError) {
    return null;
  }

  return (
    <CollectorsPill>
      <Box
        onClick={openCollectorsModal}
        css={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          cursor: 'pointer',
          zIndex: 1,
        }}
      />
      <CollectorsHeading css={{ marginRight: '$3' }}>
        Collected by
      </CollectorsHeading>
      <Box css={{ position: 'relative', zIndex: 2 }}>
        <UserStackInteractive users={topFiveCollectors} />
      </Box>

      {hasMoreCollectors && (
        <ViewAllButton onClick={openCollectorsModal}>View all</ViewAllButton>
      )}
    </CollectorsPill>
  );
}

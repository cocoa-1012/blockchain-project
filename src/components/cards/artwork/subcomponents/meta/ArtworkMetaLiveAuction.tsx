import Flex from 'components/base/Flex';
import ArtworkCardMetaBlock from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaBlock';
import ArtworkCardMetaContainer from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaContainer';
import ArtworkCardMetaLabel, {
  ArtworkCardMetaValue,
} from 'components/cards/artwork/subcomponents/meta/ArtworkCardMetaLabel';

import { ArtworkMetaProps } from 'components/cards/artwork/subcomponents/meta/types';

import useCountdown from 'hooks/use-countdown';

import { parseDateToUnix } from 'utils/dates/dates';
import { formatETHWithSuffix } from 'utils/formatters';

export default function ArtworkMetaLiveAuction(
  props: ArtworkMetaProps
): JSX.Element {
  const { auction } = props;

  const { countdownParts, hasEnded } = useCountdown(
    parseDateToUnix(auction?.endsAt)
  );

  return (
    <ArtworkCardMetaContainer css={{ backgroundColor: '$black100' }}>
      <ArtworkCardMetaBlock css={{ flex: 1 }}>
        <ArtworkCardMetaLabel css={{ color: '$black50' }}>
          Current bid
        </ArtworkCardMetaLabel>
        <ArtworkCardMetaValue color="white">
          {formatETHWithSuffix(auction?.highestBidAmount)}
        </ArtworkCardMetaValue>
      </ArtworkCardMetaBlock>

      <ArtworkCardMetaBlock css={{ textAlign: 'right' }}>
        <ArtworkCardMetaLabel css={{ color: '$black50' }}>
          Ending in
        </ArtworkCardMetaLabel>
        <Flex>
          {hasEnded ? (
            <ArtworkCardMetaValue color="white">
              Auction ended
            </ArtworkCardMetaValue>
          ) : (
            countdownParts.map(({ value, shortLabel }, key) => (
              <ArtworkCardMetaValue
                key={key}
                color="white"
                css={{ marginLeft: '$2', minWidth: 32 }}
              >
                {value}
                {shortLabel}
              </ArtworkCardMetaValue>
            ))
          )}
        </Flex>
      </ArtworkCardMetaBlock>
    </ArtworkCardMetaContainer>
  );
}

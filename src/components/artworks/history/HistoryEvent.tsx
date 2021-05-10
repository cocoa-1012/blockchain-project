import { cond, curry, pathEq, T } from 'ramda';

import { HistoricalEvent } from '@f8n/f8n-contracts/src/types/generated/subgraph';
import { HistoryEventProps } from './types';

import HistoryEventMinted from 'components/artworks/history/HistoryEventMinted';
import HistoryEventListed from 'components/artworks/history/HistoryEventListed';
import HistoryEventBid from 'components/artworks/history/HistoryEventBid';
import HistoryEventSold from 'components/artworks/history/HistoryEventSold';
import HistoryEventSettled from 'components/artworks/history/HistoryEventSettled';
import HistoryEventTransferred from 'components/artworks/history/HistoryEventTransferred';
import HistoryEventReserveChanged from 'components/artworks/history/HistoryEventReserveChanged';
import HistoryEventUnlisted from 'components/artworks/history/HistoryEventUnlisted';
import HistoryEventCreatorMigrated from 'components/artworks/history/HistoryEventCreatorMigrated';
import HistoryEventOwnerMigrated from 'components/artworks/history/HistoryEventOwnerMigrated';
import HistoryEventSellerMigrated from 'components/artworks/history/HistoryEventSellerMigrated';
import HistoryEventCreatorPaymentAddressMigrated from 'components/artworks/history/HistoryEventCreatorPaymentMigrated';

const eventStatusEq = curry(
  (event: HistoricalEvent, historyItem: HistoryEventProps) =>
    pathEq(['historyEvent', 'event'], event, historyItem)
);

// the history events we want to render and to which components
const renderHistoryItem = cond<HistoryEventProps, JSX.Element>([
  [(props) => eventStatusEq(HistoricalEvent.Minted, props), HistoryEventMinted],
  [(props) => eventStatusEq(HistoricalEvent.Listed, props), HistoryEventListed],
  [(props) => eventStatusEq(HistoricalEvent.Bid, props), HistoryEventBid],
  [(props) => eventStatusEq(HistoricalEvent.Sold, props), HistoryEventSold],
  [
    (props) => eventStatusEq(HistoricalEvent.Settled, props),
    HistoryEventSettled,
  ],
  [
    (props) => eventStatusEq(HistoricalEvent.Transferred, props),
    HistoryEventTransferred,
  ],
  [
    (props) => eventStatusEq(HistoricalEvent.PriceChanged, props),
    HistoryEventReserveChanged,
  ],
  [
    (props) => eventStatusEq(HistoricalEvent.Unlisted, props),
    HistoryEventUnlisted,
  ],
  [
    (props) => eventStatusEq(HistoricalEvent.CreatorMigrated, props),
    HistoryEventCreatorMigrated,
  ],
  [
    (props) => eventStatusEq(HistoricalEvent.OwnerMigrated, props),
    HistoryEventOwnerMigrated,
  ],
  [
    (props) => eventStatusEq(HistoricalEvent.SellerMigrated, props),
    HistoryEventSellerMigrated,
  ],
  [
    (props) =>
      eventStatusEq(HistoricalEvent.CreatorPaymentAddressMigrated, props),
    HistoryEventCreatorPaymentAddressMigrated,
  ],
  [T, () => null],
]);

export default function HistoryEvent(props: HistoryEventProps): JSX.Element {
  return renderHistoryItem(props);
}

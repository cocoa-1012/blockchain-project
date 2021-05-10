import { HistoryEventProps } from './types';

import HistoryEventGeneric from 'components/artworks/history/HistoryEventGeneric';

export default function HistoryEventBid(props: HistoryEventProps): JSX.Element {
  const { historyEvent, user } = props;

  return (
    <HistoryEventGeneric
      label="Bid placed by"
      historyEvent={historyEvent}
      user={user}
    />
  );
}

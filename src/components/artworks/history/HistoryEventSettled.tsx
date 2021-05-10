import { HistoryEventProps } from './types';

import HistoryEventGeneric from 'components/artworks/history/HistoryEventGeneric';

export default function HistoryEventSettled(
  props: HistoryEventProps
): JSX.Element {
  const { historyEvent, user } = props;

  return (
    <HistoryEventGeneric
      label="Auction settled by"
      historyEvent={historyEvent}
      user={user}
    />
  );
}

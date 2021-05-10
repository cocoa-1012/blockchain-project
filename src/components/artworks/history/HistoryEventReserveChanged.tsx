import { HistoryEventProps } from './types';

import HistoryEventGeneric from 'components/artworks/history/HistoryEventGeneric';

export default function HistoryEventReserveChanged(
  props: HistoryEventProps
): JSX.Element {
  const { historyEvent, user } = props;

  return (
    <HistoryEventGeneric
      label="Reserve changed by"
      historyEvent={historyEvent}
      user={user}
    />
  );
}

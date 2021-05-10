import { HistoryEventProps } from './types';

import HistoryEventGeneric from 'components/artworks/history/HistoryEventGeneric';

export default function HistoryEventUnlisted(
  props: HistoryEventProps
): JSX.Element {
  const { historyEvent, user } = props;

  return (
    <HistoryEventGeneric
      label="Unlisted by"
      historyEvent={historyEvent}
      user={user}
    />
  );
}

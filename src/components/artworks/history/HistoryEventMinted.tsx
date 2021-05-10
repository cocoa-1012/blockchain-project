import { HistoryEventProps } from './types';

import HistoryEventGeneric from 'components/artworks/history/HistoryEventGeneric';

export default function HistoryEventMinted(
  props: HistoryEventProps
): JSX.Element {
  const { historyEvent, user } = props;

  return (
    <HistoryEventGeneric
      label="Minted by"
      historyEvent={historyEvent}
      user={user}
    />
  );
}

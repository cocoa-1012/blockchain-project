import SplitIcon from 'assets/icons/split-icon.svg';
import ArtworkCardPill from './ArtworkCardPill';

interface ArtworkCardSplitsLabelProps {
  className?: string;
}

export default function ArtworkCardSplitsLabel(
  props: ArtworkCardSplitsLabelProps
): JSX.Element {
  const { className } = props;

  return (
    <ArtworkCardPill.Wrapper className={className}>
      <SplitIcon width={17} height={16} />
      <ArtworkCardPill.Label>Split</ArtworkCardPill.Label>
    </ArtworkCardPill.Wrapper>
  );
}

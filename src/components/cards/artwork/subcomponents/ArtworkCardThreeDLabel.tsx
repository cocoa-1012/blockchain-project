import ThreeDIcon from 'assets/icons/3d-icon.svg';
import ArtworkCardPill from './ArtworkCardPill';

interface ArtworkCardThreeDLabelProps {
  className?: string;
}

export default function ArtworkCardThreeDLabel(
  props: ArtworkCardThreeDLabelProps
): JSX.Element {
  const { className } = props;

  return (
    <ArtworkCardPill.Wrapper className={className}>
      <ThreeDIcon height={16} width={16} />
      <ArtworkCardPill.Label>3D</ArtworkCardPill.Label>
    </ArtworkCardPill.Wrapper>
  );
}

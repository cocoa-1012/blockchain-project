import Image from 'components/base/Image';
import Picture from 'components/base/Picture';

interface GraphicDividerProps {
  mobileImg: string;
  desktopImg: string;
}

export default function GraphicDivider(
  props: GraphicDividerProps
): JSX.Element {
  const { mobileImg, desktopImg } = props;

  return (
    <Picture>
      <source srcSet={desktopImg} media="(min-width: 500px)" />
      <Image
        src={mobileImg}
        alt=""
        css={{
          position: 'absolute',
          left: 0,
          right: 0,
          width: '100%',
          '@media(max-width: 500px)': { maxHeight: 700 },
        }}
      />
    </Picture>
  );
}

import { styled } from 'stitches.config';
import Image from 'components/base/Image';
import UserTagDynamic from 'components/users/UserTagDynamic';

interface CreatorCardProps {
  name: string;
  text: string;
  profilePath: string;
  imageSrc: string;
  publicKey: string;
}

const CreatorCardBox = styled('div', {
  borderRadius: '$3',
  width: '100%',
  boxShadow: '$0',
  padding: '$7',
  position: 'relative',
  background: '#fff',
  '@bp1': {
    height: 440,
  },

  a: {
    '@bp1': {
      position: 'absolute',
      right: 40,
      bottom: 40,
    },
  },
});

const CreatorCardImage = styled(Image, {
  display: 'none',
  '@bp1': {
    display: 'block',
    position: 'absolute',
    left: 40,
    bottom: 40,
    width: 100,
    height: 100,
    borderRadius: '$round',
  },
});

const Name = styled('h3', {
  fontFamily: '$body',
  fontSize: '$3',
  whiteSpace: 'nowrap',
  '@bp1': {
    transform: 'translateX(-100%) rotate(-90deg)',
    transformOrigin: 'right',
    top: 30,
    left: 40,
    position: 'absolute',
  },
});

const Paragraph = styled('p', {
  fontFamily: '$body',
  fontSize: '$0',
  lineHeight: 1.6,
  marginY: '$3',
  '@bp1': {
    fontSize: '$2',
    marginLeft: '$8',
  },
});

export default function CreatorCard(props: CreatorCardProps): JSX.Element {
  const { name, text, imageSrc, publicKey } = props;
  return (
    <CreatorCardBox>
      <Name>{name}</Name>
      <CreatorCardImage src={imageSrc} alt={name} />
      <Paragraph>{text}</Paragraph>
      <UserTagDynamic publicKey={publicKey} />
    </CreatorCardBox>
  );
}

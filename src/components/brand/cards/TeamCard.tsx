import { styled } from 'stitches.config';
import Image from 'components/base/Image';

interface TeamCardProps {
  name: string;
  title: string;
  location: string;
  profilePath: string;
  imageSrc: string;
}

const TeamCardBox = styled('a', {
  display: 'flex',
  borderRadius: '$3',
  width: '100%',
  height: 267,
  boxShadow: '$0',
  padding: '$7',
  position: 'relative',
  flexDirection: 'column',
  justifyContent: 'space-between',
  textDecoration: 'none',
  color: '$black100',
  transition: 'transform $1 $ease, box-shadow $1 $ease',
  background: '#fff',

  '@media (hover: hover)': {
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '$1',
    },
  },
});

const TeamCardImage = styled(Image, {
  width: 100,
  height: 100,
  borderRadius: '$round',
});

const Location = styled('span', {
  fontFamily: '$mono',
  fontSize: '$0',
  position: 'absolute',
  top: 30,
  right: 30,
  letterSpacing: 1,
});

const Name = styled('h3', {
  fontFamily: '$body',
  fontSize: '$3',
});

const Title = styled('h4', {
  fontFamily: '$mono',
  lineHeight: '1.5',
  letterSpacing: 1,
  fontSize: '$0',
  textTransform: 'uppercase',
});

export default function TeamCard(props: TeamCardProps): JSX.Element {
  const { name, title, location, profilePath, imageSrc } = props;
  return (
    <TeamCardBox href={profilePath}>
      <TeamCardImage src={imageSrc} alt={name} />
      <Name>{name}</Name>
      <Title>{title}</Title>
      <Location>{location}</Location>
    </TeamCardBox>
  );
}

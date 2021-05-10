import { styled } from 'stitches.config';
import Box from 'components/base/Box';
import Paragraph from './Paragraph';

interface InfoModuleProps {
  emoji: string;
  title: string;
  text?: string;
  benefits?: string[];
}

const Title = styled('h4', {
  fontFamily: '$body',
  letterSpacing: -0.5,
  fontSize: '$4',
  lineHeight: 1.3,
  fontWeight: 400,
  marginTop: '$2',
  marginBottom: '$3',
});

const Emoji = styled('span', {
  fontSize: 56,
});

const List = styled('ul', {
  marginLeft: '$5',
  listStyle: 'disc'
})

const ListElement = styled('li', {
  marginBottom: '$3'
})

export default function InfoModule(props: InfoModuleProps): JSX.Element {
  const { emoji, title, text, benefits } = props;
  return (
    <Box>
      <Emoji role="image">{emoji}</Emoji>
      <Title>{title}</Title>
      <Paragraph>{text}</Paragraph>
      <List>
      {benefits &&
        benefits.map((benefit) => (
          <ListElement key={benefit} style={{marginBottom: 10}}><Paragraph>{benefit}</Paragraph></ListElement>
        ))}
        </List>
    </Box>
  );
}

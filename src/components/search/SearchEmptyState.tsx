import Text from 'components/base/Text';
import Heading from 'components/base/Heading';
import Grid from 'components/base/Grid';

import SearchIcon from 'assets/icons/search-icon.svg';

interface SearchEmptyStateProps {
  heading: string;
  description: string;
  headingSize: '$4' | '$3';
}

export default function SearchEmptyState(
  props: SearchEmptyStateProps
): JSX.Element {
  const { heading, description, headingSize } = props;
  return (
    <Grid css={{ gap: '$4' }}>
      <Grid css={{ gap: '$7', justifyContent: 'center' }}>
        <SearchIcon
          width={20}
          height={20}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
        <Heading
          tracking="tight"
          leading="tight"
          css={{
            fontWeight: 'bold',
            fontFamily: '$body',
            fontSize: headingSize,
            letterSpacing: '-0.01em',
          }}
        >
          {heading}
        </Heading>
      </Grid>

      <Text
        css={{
          fontFamily: '$body',
          maxWidth: 360,
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6,
          textAlign: 'center',
          color: '$black50',
        }}
      >
        {description}
      </Text>
    </Grid>
  );
}

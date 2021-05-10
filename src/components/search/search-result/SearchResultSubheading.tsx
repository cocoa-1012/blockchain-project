import { ReactNode } from 'react';

import Heading from 'components/base/Heading';
import Text from 'components/base/Text';

interface SearchResultSubheadingProps {
  isMono: boolean;
  children: ReactNode;
}

export default function SearchResultSubheading(
  props: SearchResultSubheadingProps
): JSX.Element {
  const { isMono, children } = props;
  return (
    <Heading
      tracking="tight"
      leading="tight"
      css={{
        display: 'flex',
        color: '$black100',
        fontFamily: isMono ? '$mono' : '$body',
        fontWeight: isMono ? 'normal' : 'bold',
      }}
    >
      <Text color={isMono ? null : 'rainbow'}>{children}</Text>
    </Heading>
  );
}

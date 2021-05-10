import { ReactNode } from 'react';

import Button from 'components/base/Button';
import Link from 'components/links/Link';

interface ArtworkCardMetaButtonProps {
  href: string;
  children: ReactNode;
}

export default function ArtworkCardMetaButton(
  props: ArtworkCardMetaButtonProps
): JSX.Element {
  const { href, children } = props;

  return (
    <Link href={href}>
      <a style={{ display: 'block', textDecoration: 'none', width: '100%' }}>
        <Button
          color="white"
          shape="regular"
          css={{ height: 49, width: '100%', display: 'block', paddingX: '$5' }}
        >
          {children}
        </Button>
      </a>
    </Link>
  );
}

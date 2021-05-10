import { useField } from 'formik';

import Flex from 'components/base/Flex';
import PercentField from 'components/forms/fields/PercentField';
import Icon from 'components/Icon';
import HoverableIcon from 'components/HoverableIcon';
import UserTagV2 from 'components/users/UserTagV2';
import Link from 'components/links/Link';

import { areKeysEqual } from 'utils/users';
import { buildUserProfilePath } from 'utils/artwork/artwork';

import RemoveIcon from 'assets/icons/remove-icon.svg';

import type Account from 'types/Account';
import type { RevenueShare } from 'types/Share';

interface SplitRowProps {
  share: RevenueShare;
  user: Account;
  index: number;
  removeSplit: () => void;
  isLoading: boolean;
  currentUserPublicAddress: string;
}

export default function SplitRow(props: SplitRowProps): JSX.Element {
  const {
    share,
    index,
    user,
    removeSplit,
    isLoading,
    currentUserPublicAddress,
  } = props;

  const [field] = useField(`shares.${index}.address`);

  const isCurrentUser = areKeysEqual([field.value, currentUserPublicAddress]);

  return (
    <Flex css={{ alignItems: 'center' }}>
      <Flex css={{ flexGrow: 1 }}>
        <Link href={buildUserProfilePath({ user })}>
          <a
            style={{ textDecoration: 'none', display: 'block' }}
            target="_blank"
            rel="noreferrer"
          >
            <UserTagV2 user={user} isLoading={isLoading} hoverable />
          </a>
        </Link>
      </Flex>

      <Flex css={{ alignItems: 'center' }}>
        <PercentField name={`shares.${index}.shareInPercentage`} />
        <HoverableIcon
          css={{
            cursor: 'pointer',
            marginLeft: '$6',
            pointerEvents: isCurrentUser ? 'none' : 'all',
            opacity: isCurrentUser ? 0 : 1,
          }}
          onClick={removeSplit}
        >
          <Icon icon={RemoveIcon} width={16} height={16} />
        </HoverableIcon>
      </Flex>
    </Flex>
  );
}

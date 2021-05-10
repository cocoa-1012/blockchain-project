import { FieldArray, useField } from 'formik';

import Grid from 'components/base/Grid';
import SplitRow from 'components/transactions/split/SplitRow';

import useUsersByPublicKeys from 'hooks/queries/hasura/use-users-by-public-keys';

import { findUserByPublicKey, getUsers } from 'utils/users';
import { maybeGetAddress } from 'utils/users';
import { buildPercentToUse } from 'utils/split';

import type { RevenueShare } from 'types/Share';
import Account from 'types/Account';

interface SplitSectionProps {
  currentUserPublicAddress: string;
}

// Note: This component assumes values.shares being defined
// It's the role of the consuming component to ensure that
export default function SplitSection(props: SplitSectionProps): JSX.Element {
  const { currentUserPublicAddress } = props;

  const [field] = useField<RevenueShare[]>('shares');

  const splitValues = field.value ?? [];

  const userPublicKeys = splitValues.map((split) =>
    maybeGetAddress(split.address)
  );

  const { data: usersData, isLoading: usersLoading } = useUsersByPublicKeys({
    publicKeys: userPublicKeys,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const splitUsers = getUsers<unknown, Account[]>(usersData);

  return (
    <Grid css={{ gap: '$4' }}>
      <FieldArray
        name="shares"
        render={(arrayHelpers) => (
          <Grid css={{ gap: '$4' }}>
            {splitValues.map((share, index) => {
              const matchedUser = findUserByPublicKey(
                share.address,
                splitUsers
              );
              // if the user isn’t in our db, provide a fallback
              const fallbackUser = { publicKey: share.address };
              return (
                <SplitRow
                  key={index}
                  share={share}
                  index={index}
                  user={matchedUser ?? fallbackUser}
                  removeSplit={() => {
                    splitValues.map((share, index) => {
                      share.shareInPercentage = buildPercentToUse(
                        splitValues.length - 1,
                        index
                      );
                      arrayHelpers.replace(index, share);
                      return share;
                    });
                    arrayHelpers.remove(index);
                  }}
                  isLoading={usersLoading}
                  currentUserPublicAddress={currentUserPublicAddress}
                />
              );
            })}
          </Grid>
        )}
      />
    </Grid>
  );
}

import * as Yup from 'yup';
import { areKeysEqual } from 'utils/users';

export const MigrateAccountSchema = Yup.object().shape({
  to: Yup.string()
    .matches(/^0x[a-fA-F0-9]{40}$/g, 'Invalid address')
    .required('To address is required')
    .test('fromTest', 'To & From cant be the same', function (value) {
      const from = this.parent.from;
      return !areKeysEqual([value, from]);
    }),
});

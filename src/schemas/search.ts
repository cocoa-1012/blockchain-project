import * as Yup from 'yup';
import { isNonZeroNumber } from 'utils/formatters';

export const SearchSchema = (min: number, max: number) => {
  return Yup.object().shape({
    min: Yup.number()
      .min(min, 'Must be at least ${min} ETH')
      .max(max, 'Must be at least ${max} ETH')
      .when('max', {
        is: isNonZeroNumber,
        then: Yup.number().max(Yup.ref('max')),
        otherwise: Yup.number(),
      }),
    max: Yup.number()
      .min(min, 'Must be at least ${min} ETH')
      .max(max, 'Must be at least ${max} ETH')
      .required('Max price is required'),
  });
};

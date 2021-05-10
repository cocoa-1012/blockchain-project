import { parseFiat } from 'utils/formatters';
import * as Yup from 'yup';

export const ListArtworkSchema = Yup.object().shape({
  price: Yup.number()
    .transform((o, v) => parseFiat(v))
    .min(0.1, 'Must be at least ${min} ETH')
    .max(100000, 'Must be less than ${max} ETH')
    .nullable()
    .required('Reserve price is required'),
});

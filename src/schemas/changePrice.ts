import { parseFiat } from 'utils/formatters';
import * as Yup from 'yup';

export const ChangePriceArtworkSchema = Yup.object().shape({
  price: Yup.number()
    .transform((o, v) => parseFiat(v))
    .min(0.1, `Must be at least 0.1 ETH`)
    .nullable()
    .required('Token amount is required'),
});

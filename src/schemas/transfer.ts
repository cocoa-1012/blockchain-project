import * as Yup from 'yup';

export const TransferArtworkSchema = Yup.object().shape({
  to: Yup.string()
    .matches(/^0x[a-fA-F0-9]{40}$/g, 'Invalid address')
    .required('To address is required'),
});

import * as Yup from 'yup';

export const AgreeToTOSSchema = Yup.object().shape({
  original: Yup.boolean().oneOf([true]),
  kind: Yup.boolean().oneOf([true]),
  creative: Yup.boolean().oneOf([true]),
});

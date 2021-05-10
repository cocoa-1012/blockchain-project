import * as Yup from 'yup';

export const NewsletterSchema = Yup.object().shape({
  email: Yup.string()
    .nullable()
    .email('This doesn’t look like a valid email')
    .required('Email is required'),

  weeklyNewsletter: Yup.boolean().oneOf([true], 'Required'),
});

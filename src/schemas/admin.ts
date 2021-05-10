import * as Yup from 'yup';

export const SetInvitesSchema = Yup.object().shape({
  newInvites: Yup.number()
    .integer()
    .max(100, 'You can only give a max of 100 invites at a time')
    .required('You must provide a number of invites'),
});

export const ReportFormSchema = Yup.object().shape({
  email: Yup.string().email().required('Email address is required'),
  description: Yup.string().required('A description is required'),
});

import * as Yup from 'yup';

export const ContactInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Must be at least two characters')
    .nullable()
    .max(50, 'Can’t be more than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Must be at least two characters')
    .max(50, 'Can’t be more than 50 characters')
    .nullable()
    .required('Last name is required'),
  email: Yup.string()
    .email('This doesn’t look like a valid email')
    .nullable()
    .required('Email address is required'),
});

export const ShippingInfoSchema = Yup.object().shape({
  shippingInfo: Yup.object().shape({
    line1: Yup.string().required('Address is required'),
    line2: Yup.string(),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Post/ZIP code is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
  }),
});

export const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email('This doesn’t look like a valid email')
    .nullable()
    .required('Email address is required'),
});

export const URL_REGEX = /^(?:(ftp|http|https):\/\/)?(?:[\w-]+\.)+[a-z]{2,24}/g;

export const LinksSchema = Yup.object().shape({
  website: Yup.object().shape({
    platform: Yup.string(),
    handle: Yup.string()
      .matches(URL_REGEX, 'That URL doesn’t look valid')
      .nullable(),
  }),
  instagram: Yup.object().shape({
    platform: Yup.string(),
    handle: Yup.string().nullable(),
  }),
  twitter: Yup.object().shape({
    platform: Yup.string(),
    handle: Yup.string().nullable(),
  }),
  youtube: Yup.object().shape({
    platform: Yup.string(),
    handle: Yup.string()
      .matches(URL_REGEX, 'That URL doesn’t look valid')
      .nullable(),
  }),
  facebook: Yup.object().shape({
    platform: Yup.string(),
    handle: Yup.string().nullable(),
  }),
  twitch: Yup.object().shape({
    platform: Yup.string(),
    handle: Yup.string().nullable(),
  }),
  tiktok: Yup.object().shape({
    platform: Yup.string(),
    handle: Yup.string().nullable(),
  }),
  discord: Yup.object().shape({
    platform: Yup.string(),
    handle: Yup.string()
      // copied from https://stackoverflow.com/a/51507374/1837427
      .matches(/^((.+?)#\d{4})/, 'That handle doesn’t look valid')
      .nullable(),
  }),
  snapchat: Yup.object().shape({
    platform: Yup.string(),
    handle: Yup.string()
      .matches(
        // https://stackoverflow.com/questions/39819830/what-are-the-allowed-character-in-snapchat-username
        /^[a-zA-Z][\w-_.]{1,13}[\w]$/g,
        'That handle doesn’t look valid'
      )
      .nullable(),
  }),
});

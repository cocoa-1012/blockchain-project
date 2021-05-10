import * as Yup from 'yup';

import { UNLOCKABLE_CONTENT_MAX_CHARS } from 'lib/constants';
import { RevenueShare } from 'types/Share';
import { countDecimals } from 'utils/formatters';

const ShareObject = Yup.object().shape({
  address: Yup.string(),
  shareInPercentage: Yup.number()
    .positive()
    .max(100, 'Can’t be more than 100%')
    .test(
      'maxDigitsAfterDecimal',
      'number field must have 2 digits after decimal or fewer',
      (number) => {
        const numberOfDecimals = countDecimals(number);
        return numberOfDecimals <= 2;
      }
    ),
});

const nameField = Yup.string()
  .min(2, 'Must be at least two characters')
  .nullable()
  .max(50, 'Can’t be more than 50 characters');

export const MintArtworkSchema = Yup.object().shape({
  name: nameField.when('isDraft', {
    is: false,
    then: nameField.required('Artwork name is required'),
  }),
  description: Yup.string()
    .max(1000, 'Can’t be more than 1000 characters')
    .nullable(),
  isDraft: Yup.bool().required(),
  isUsingASplit: Yup.bool().required(),
  downloadableUrl: Yup.string()
    .max(UNLOCKABLE_CONTENT_MAX_CHARS, 'Can’t be more than 200 characters')
    .nullable(),
  shares: Yup.array().when('isUsingASplit', {
    is: true,
    otherwise: Yup.array(),
    then: Yup.array()
      .min(2, 'You need at least two recipients')
      .max(4, 'You can have at most four recipients')
      .of(ShareObject)
      .test(
        'sumOfShares',
        'The split percentages need to add up to 100',
        (shares: RevenueShare[]) => {
          if (shares.length === 0) {
            return true;
          }
          const reducer = (accumulator: number, currentValue: RevenueShare) =>
            accumulator + currentValue?.shareInPercentage;
          const sum = shares.reduce(reducer, 0);
          return sum == 100;
        }
      ),
  }),
});

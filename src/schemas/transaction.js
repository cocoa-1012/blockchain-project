import { ceilETHWithSuffix, parseFiat } from 'utils/formatters';
import * as Yup from 'yup';

export const TokenAmountSchema = Yup.object().shape({
  amount: Yup.number()
    .min(0.01, 'Must be at least 0.01')
    .nullable()
    .max(3, 'Can’t be more than 3')
    .required('Token amount is required'),
});

export const createTokenAmountSchema = ({ min, max }) => {
  return Yup.object().shape({
    amount: Yup.number()
      .transform((o, v) => parseFiat(v))
      .min(min, `Must be at least ${min}`)
      .nullable()
      .max(max, `Can’t be more than ${max}`)
      .required('Token amount is required'),
  });
};

export const createBidAmountSchema = ({ min, max }) => {
  return Yup.object().shape({
    amount: Yup.number()
      .transform((o, v) => parseFiat(v))
      .min(min, `Your bid must be at least ${ceilETHWithSuffix(min)}`)
      .nullable()
      .max(max, `You don’t have enough ETH`)
      .required('Bid amount is required'),
  });
};

export const createMintSchema = () => {
  // TODO: Add more validation here
  return Yup.object().shape({
    title: Yup.string(),
    description: Yup.string(),
  });
};

export const CardDepositAmountSchema = Yup.object().shape({
  amount: Yup.number()
    .min(1, 'Must be at least 1')
    .nullable()
    .max(500, 'Can’t be more than 500')
    .required('Token amount is required'),
});

export const AcceptBidSchema = Yup.object().shape({
  tokenId: Yup.string().required('Token id is required'),
  publicAddress: Yup.string()
    .length(42, 'Incorrect length')
    .matches(/^0x[a-fA-F0-9]{40}$/g, 'Incorrect address'),
  ownerAddress: Yup.mixed().test(
    'match',
    'Only the owner can accept bids',
    function () {
      return this.parent.publicAddress === this.parent.ownerAddress;
    }
  ),
  amount: Yup.number()
    .transform((o, v) => parseFiat(v))
    .min(0, `Bid amount must be at least 0`)
    .nullable()
    .required('Bid amount is required'),
});

export const TagSchema = Yup.object().shape({
  data: Yup.object().shape({
    tags: Yup.array()
      .test('Unique', 'Duplicate tags not accepted', (tags) => {
        return new Set(tags).size === tags.length;
      })
      .max(10, 'A maximum of 10 tags can be added to an NFT.'),
  }),
});

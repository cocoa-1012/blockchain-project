import { gql } from '@apollo/client';
import { HasuraSocialVerificationFragment } from './hasura-fragments';

export const GET_HASURA_SOCIAL_VERIFICATIONS_TWITTER_BY_PUBLIC_KEY = gql`
  query socialVerificationsTwitterByPublicKey($publicKey: String!) {
    socialVerifications: social_verification(
      where: {
        user: { _eq: $publicKey }
        isValid: { _is_null: false }
        service: { _eq: "TWITTER" }
      }
      limit: 1
      order_by: { createdAt: desc }
    ) {
      ...HasuraSocialVerificationFragment
    }
  }
  ${HasuraSocialVerificationFragment}
`;

export const GET_HASURA_SOCIAL_VERIFICATIONS_INSTAGRAM_BY_PUBLIC_KEY = gql`
  query socialVerificationsInstagramByPublicKey($publicKey: String!) {
    socialVerifications: social_verification(
      where: {
        user: { _eq: $publicKey }
        isValid: { _is_null: false }
        service: { _eq: "INSTAGRAM" }
      }
      limit: 1
      order_by: { createdAt: desc }
    ) {
      ...HasuraSocialVerificationFragment
    }
  }
  ${HasuraSocialVerificationFragment}
`;

export const GET_HASURA_VALID_SOCIAL_VERIFICATIONS_INSTAGRAM_BY_PUBLIC_KEY = gql`
  query validSocialVerificationsInstagramByPublicKey($publicKey: String!) {
    socialVerifications: social_verification(
      where: {
        user: { _eq: $publicKey }
        isValid: { _eq: true }
        service: { _eq: "INSTAGRAM" }
      }
      limit: 1
      order_by: { createdAt: desc }
    ) {
      ...HasuraSocialVerificationFragment
    }
  }
  ${HasuraSocialVerificationFragment}
`;

export const GET_HASURA_VALID_SOCIAL_VERIFICATIONS_TWITTER_BY_PUBLIC_KEY = gql`
  query validSocialVerificationsTwitterByPublicKey($publicKey: String!) {
    socialVerifications: social_verification(
      where: {
        user: { _eq: $publicKey }
        isValid: { _eq: true }
        service: { _eq: "TWITTER" }
      }
      limit: 1
      order_by: { createdAt: desc }
    ) {
      ...HasuraSocialVerificationFragment
    }
  }
  ${HasuraSocialVerificationFragment}
`;

export const GET_HASURA_VALID_SOCIAL_VERIFICATIONS_TWITTER_BY_USERNAME = gql`
  query validSocialVerificationsTwitterByUsername($username: String!) {
    socialVerifications: social_verification(
      where: {
        username: { _eq: $username }
        isValid: { _eq: true }
        service: { _eq: "TWITTER" }
      }
      limit: 1
      order_by: { createdAt: desc }
    ) {
      ...HasuraSocialVerificationFragment
    }
  }
  ${HasuraSocialVerificationFragment}
`;

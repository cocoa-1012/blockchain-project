import { gql } from '@apollo/client';

export const CREATE_SOCIAL_VERIFICATION_VIA_URL = gql`
  mutation createSocialVerificationViaURL($socialVerificationURL: String!) {
    createSocialVerificationViaURL(
      socialVerificationURL: $socialVerificationURL
    ) {
      socialVerificationURL
      createdAt
    }
  }
`;

export const DELETE_SOCIAL_VERIFICATION = gql`
  mutation deleteSocialVerification($id: String!) {
    deleteSocialVerification(id: $id)
  }
`;

export const CREATE_INSTAGRAM_VERIFICATION = gql`
  mutation createSocialVerificationInstagram(
    $code: String!
    $redirectURI: String!
  ) {
    createSocialVerificationInstagram(code: $code, redirectURI: $redirectURI)
  }
`;

export const OVERWRITE_INSTAGRAM_VERIFICATION = gql`
  mutation overwriteSocialVerificationInstagram($id: String!) {
    overwriteSocialVerificationInstagram(id: $id)
  }
`;

/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';

import UserInfoFields from './UserInfoFields';
import UserBioFields from './UserBioFields';
import UserAvatarFields from './UserAvatarFields';
import UserCoverFields from './UserCoverFields';
import UserSocialFields from './UserSocialFields';
import UserEmailFields from './UserEmailFields';
import UserVerifyFields from './UserVerifyFields';
import SocialVerification from 'types/SocialVerification';

interface UserFormFieldsProps {
  token: string;
  twitterSocialVerification: SocialVerification;
  instagramSocialVerification: SocialVerification;
  publicAddress: string;
}

export default function UserFormFields(
  props: UserFormFieldsProps
): JSX.Element {
  const {
    token,
    twitterSocialVerification,
    instagramSocialVerification,
    publicAddress,
  } = props;

  return (
    <>
      <UserInfoFields />
      <UserEmailFields />
      <UserBioFields />
      <UserAvatarFields token={token} />
      <UserCoverFields token={token} />
      <UserVerifyFields
        twitterSocialVerification={twitterSocialVerification}
        instagramSocialVerification={instagramSocialVerification}
        token={token}
        publicAddress={publicAddress}
      />
      <UserSocialFields />
    </>
  );
}

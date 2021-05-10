/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { cond, equals, always } from 'ramda';

import ModerationStatus from 'types/ModerationStatus';

import ProfileSuspended from './ProfileSuspended';
import ProfileUnderReview from './ProfileUnderReview';
import Page from 'components/Page';

interface ProfileWarningPageProps {
  title: string;
  children: JSX.Element;
}

function ProfileWarningPage(props: ProfileWarningPageProps): JSX.Element {
  const { title, children } = props;
  return <Page title={title}>{children}</Page>;
}

const renderProfileWarningBlock = cond<ModerationStatus, JSX.Element>([
  [
    equals(ModerationStatus.Suspended),
    always(
      <ProfileWarningPage title="Profile Suspended">
        <ProfileSuspended />
      </ProfileWarningPage>
    ),
  ],
  [
    equals(ModerationStatus.UnderReview),
    always(
      <ProfileWarningPage title="Profile Under Review">
        <ProfileUnderReview />
      </ProfileWarningPage>
    ),
  ],
]);

export default renderProfileWarningBlock;

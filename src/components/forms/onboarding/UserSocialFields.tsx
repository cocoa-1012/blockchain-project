/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Grid, Heading } from 'theme-ui';
import { Field } from 'formik';

import { socialLinks } from 'utils/social-links';
import SocialField from 'components/forms/fields/SocialField';
import { SocialLinkType } from 'types/SocialLink';

export default function UserSocialFields(): JSX.Element {
  return (
    <Box>
      <Heading variant="h.s" sx={{ maxWidth: 240, mb: 'l' }}>
        Add links to your social media profiles.
      </Heading>
      <Grid gap={10}>
        {socialLinks.map((link) => {
          if (
            link.type === SocialLinkType.twitter ||
            link.type === SocialLinkType.instagram
          ) {
            return null;
          }
          return (
            <Box key={link.type}>
              <Field
                name={`links.${link.type}.platform`}
                value={link.type}
                type="hidden"
              />
              <SocialField {...link} name={`links.${link.type}.handle`} />
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}

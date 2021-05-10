/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Box, Text } from 'theme-ui';
import ReactMarkdown from 'react-markdown';

interface ProfileBioProps {
  bio: string;
}

export default function ProfileBio(props: ProfileBioProps): JSX.Element {
  const { bio } = props;

  return (
    <Box>
      <Text
        variant="stnd.sub"
        sx={{
          lineHeight: 1.6,
          fontSize: 'sub',
          '& p': {
            marginBottom: '1rem',
          },
          '& p:last-of-type': {
            marginBottom: 0,
          },
        }}
      >
        <ReactMarkdown plugins={[require('remark-breaks')]}>
          {bio}
        </ReactMarkdown>
      </Text>
    </Box>
  );
}

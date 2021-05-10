/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text } from 'theme-ui';
import ReactMarkdown from 'react-markdown';

import {
  listStylePositionInside,
  positionRelative,
  whiteSpaceNormal,
} from 'types/styles';

import { transitions } from 'utils/themes/main/theme';

import useViewMore from 'hooks/use-view-more';

interface MarkdownTextProps {
  text: string;
}

function MarkdownText(props: MarkdownTextProps): JSX.Element {
  const { text } = props;
  return (
    <ReactMarkdown plugins={[require('remark-breaks')]}>{text}</ReactMarkdown>
  );
}

interface ArtworkCardDescriptionProps {
  text: string;
}

export default function ArtworkCardDescription(
  props: ArtworkCardDescriptionProps
): JSX.Element {
  const { text } = props;

  const {
    previewText,
    remainingText,
    hasPreview,
    isViewingMore,
    setIsViewingMore,
  } = useViewMore(text);

  const handleReadMore = () => {
    setIsViewingMore((prev) => !prev);
  };

  const fullText =
    isViewingMore || !hasPreview
      ? `${previewText} ${remainingText}`
      : `${previewText}…`;

  return (
    <>
      <Text variant="stnd.body" sx={styles.descriptionText}>
        <MarkdownText text={fullText} />
      </Text>

      {hasPreview && (
        <Text
          variant="stnd.body"
          sx={{
            position: positionRelative,
            display: 'inline-block',
            fontWeight: 600,
            color: 'black.50',
            zIndex: 2,
            transition: transitions.smooth.fast,
            '&:hover': { color: 'black.100' },
          }}
          onClick={handleReadMore}
        >
          {isViewingMore ? 'View less' : 'View more'}
        </Text>
      )}
    </>
  );
}

const styles = {
  descriptionText: {
    '& > p': {
      lineHeight: 1.6,
      marginBottom: 'xxs',
    },
    '& > p:not(:last-of-type)': {
      marginBottom: 's',
    },
    '& > ol': {
      lineHeight: 1.6,
      listStylePosition: listStylePositionInside,
    },
    '& > pre': {
      fontFamily: 'body',
      whiteSpace: whiteSpaceNormal,
    },
    '& code': {
      fontFamily: 'body',
      whiteSpace: whiteSpaceNormal,
      lineHeight: 1.6,
    },
  },
};

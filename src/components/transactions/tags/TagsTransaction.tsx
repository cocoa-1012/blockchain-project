/* eslint-disable react/jsx-max-depth */
import React from 'react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';

import Grid from 'components/base/Grid';
import ArtworkCardMinimal from 'components/cards/artwork/ArtworkCardMinimal';
import Heading from 'components/base/Heading';
import Box from 'components/base/Box';
import Text from 'components/base/Text';
import TagsTextarea from './TagsTextarea';

import { Option } from './types';
import { BasicArtwork } from 'types/Artwork';

import { TagSchema } from 'schemas/transaction';

import {
  UpdateArtworkTagsVariables,
  useUpdateArtworkTags,
} from 'graphql/server/mutations/update-artwork-tags.generated';
import {
  PreviousPageButtonAnchor,
  PreviousPageLink,
} from 'components/navigation/PreviousPageButton';

interface TagsTransactionProps {
  listArtworkPath: string;
  options: Option[];
  artwork: BasicArtwork;
  title: string;
  isInCreatorFlow: boolean;
}

export default function TagsTransaction(
  props: TagsTransactionProps
): JSX.Element {
  const router = useRouter();

  const { artwork, listArtworkPath, options, title, isInCreatorFlow } = props;

  const { mutateAsync } = useUpdateArtworkTags();

  const handleSubmit = async (values: UpdateArtworkTagsVariables) => {
    await mutateAsync(values);
    await router.push(listArtworkPath);
  };

  return (
    <>
      {!isInCreatorFlow && (
        <PreviousPageButtonAnchor>
          <PreviousPageLink href={listArtworkPath} />
        </PreviousPageButtonAnchor>
      )}

      <Grid
        css={{
          gridTemplateColumns: 'minmax(340px, 1fr) minmax(600px, 2fr)',
          gridColumnGap: '$7',
          maxWidth: 1040,
          marginX: 'auto',
        }}
      >
        <Box>
          <ArtworkCardMinimal artwork={artwork} creator={artwork?.creator} />
        </Box>
        <Box>
          <Grid
            css={{
              background: '$white100',
              padding: '$9',
              borderRadius: '$2',
              boxShadow: '$0',
            }}
          >
            <Formik<UpdateArtworkTagsVariables>
              onSubmit={handleSubmit}
              validationSchema={TagSchema}
              enableReinitialize
              initialValues={{
                data: {
                  id: artwork?.id,
                  tags: artwork?.tags,
                },
              }}
            >
              <Form style={{ display: 'flex', flexDirection: 'column' }}>
                <Heading
                  css={{
                    letterSpacing: '-0.8px',
                    fontSize: '$4',
                    marginBottom: '$4',
                  }}
                >
                  {title}
                </Heading>
                <Text
                  css={{
                    fontSize: '$1',
                    fontFamily: '$body',
                    lineHeight: 1.6,
                    marginBottom: '$7',
                  }}
                >
                  Add up to 10 tags to your NFT to help people find and discover
                  it across Foundation. Use the return key to add multiple.
                </Text>
                <TagsTextarea
                  name="data.tags"
                  options={options}
                  listArtworkPath={listArtworkPath}
                  isInCreatorFlow={isInCreatorFlow}
                />
              </Form>
            </Formik>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}

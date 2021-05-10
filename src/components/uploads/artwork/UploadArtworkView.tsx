/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Grid, Flex } from 'theme-ui';
import { useFormikContext } from 'formik';
import { useCallback, useState } from 'react';
import Router from 'next/router';

import Body from 'components/Body';
import UploadArtworkForm from 'components/uploads/artwork/UploadArtworkForm';
import UploadArtworkSubmitButton from 'components/uploads/artwork/UploadArtworkSubmitButton';
import UploadArtworkProgress from 'components/uploads/artwork/UploadArtworkProgress';
import DropzoneField from 'components/forms/fields/DropzoneField';

import { UploadArtworkFormValues } from 'components/uploads/artwork/types';

interface UploadArtworkViewProps {
  onSubmit: (values: UploadArtworkFormValues) => void;
  progressPercentage: number;
  resetUpload: () => void;
}

export default function UploadArtworkView(
  props: UploadArtworkViewProps
): JSX.Element {
  const { onSubmit, progressPercentage, resetUpload } = props;

  const sx = getStyles();

  return (
    <Body sx={sx.container}>
      <UploadArtworkForm onSubmit={onSubmit}>
        <RenderArtworkForm
          progressPercentage={progressPercentage}
          cancelUpload={resetUpload}
        />
      </UploadArtworkForm>
    </Body>
  );
}

interface RenderArtworkFormProps {
  progressPercentage: number;
  cancelUpload: () => void;
}

function RenderArtworkForm(props: RenderArtworkFormProps): JSX.Element {
  const { progressPercentage, cancelUpload } = props;
  const sx = getStyles();

  const { isSubmitting, submitCount, resetForm } = useFormikContext();

  const [isRouteChanging, setRouteChanging] = useState(false);

  Router.events.on('routeChangeStart', () => {
    setRouteChanging(true);
  });

  const cancelUploadAndReset = useCallback(() => {
    resetForm();
    cancelUpload();
  }, [resetForm, cancelUpload]);

  const hasSubmitted = submitCount > 0 && isRouteChanging;

  if (isSubmitting || hasSubmitted) {
    return (
      <UploadArtworkProgress
        progressPercentage={progressPercentage}
        cancelUpload={cancelUploadAndReset}
      />
    );
  }

  return (
    <>
      <Grid sx={sx.grid}>
        <DropzoneField name="file" />
      </Grid>
      <Flex sx={{ paddingTop: 'xl', justifyContent: 'center' }}>
        <UploadArtworkSubmitButton />
      </Flex>
    </>
  );
}

const getStyles = () => ({
  container: {
    display: 'grid',
    flex: 'auto',
    alignItems: 'center',
    maxWidth: 1160,
  },
  grid: {
    flex: 'auto',
    alignItems: 'stretch',
    minHeight: 520,
    gap: 0,
  },
});

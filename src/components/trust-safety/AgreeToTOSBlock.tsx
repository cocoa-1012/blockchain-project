/* eslint-disable react/jsx-max-depth */
/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import {
  jsx,
  Box,
  Heading,
  Grid,
  Flex,
  Text,
  ThemeUIStyleObject,
} from 'theme-ui';
import { useMutation } from 'react-query';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';

import InternalInlineLink from 'components/links/InternalInlineLink';
import LoadingButton from 'components/buttons/LoadingButton';

import { AgreeToTOSSchema } from 'schemas/TOS';

import { setUserOneTimeAction } from 'queries/oneTimeActions';

import { ActionType } from 'types/ActionType';
import CheckboxAndWrapper from 'components/forms/CheckboxAndWrapper';

interface AgreeToTOSBlockProps {
  token: string;
}

export default function AgreeToTOSBlock(
  props: AgreeToTOSBlockProps
): JSX.Element {
  const { token } = props;
  const sx = getStyles();

  const router = useRouter();
  const { mutateAsync: agreeToTOS, isLoading, isSuccess } = useMutation(
    setUserOneTimeAction
  );

  const handleSubmit = async () => {
    await agreeToTOS({
      actionType: ActionType['AcceptWelcomeScreen1.0'],
      token,
    });
    router.reload();
  };

  return (
    <Flex sx={sx.container}>
      <Box>
        <Heading variant="h.l" sx={{ textAlign: 'center', mb: 's' }}>
          Welcome to Foundation!
        </Heading>
        <Grid gap="l" sx={{ mb: 'm' }}>
          <Text sx={sx.text} variant="body.body">
            Before you mint your first NFT, please read through and agree to our
            Community Guidelines.
          </Text>
          <Text sx={sx.summary} variant="body.body">
            Here’s a summary…
          </Text>
        </Grid>

        <Box>
          <Formik
            initialValues={{ original: false, kind: false, creative: false }}
            validationSchema={AgreeToTOSSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              const { isValid, dirty } = props;

              return (
                <Form>
                  <Grid sx={{ gridRowGap: 's' }}>
                    <CheckboxAndWrapper
                      name="original"
                      label="Be original"
                      description="Only mint original artworks that you have created. Do
                        not upload anyone else’s copyrighted work, and do not
                        spoof other artists."
                    />
                    <CheckboxAndWrapper
                      name="kind"
                      label="Be kind and inclusive."
                      description="Do not upload anything that’s racist, sexist,
                    homophobic, transphobic, or otherwise harmful to our
                    community."
                    />
                    <CheckboxAndWrapper
                      name="creative"
                      label="Be creative and have fun."
                      description="We are building this new creative economy together, and
                    are excited to see your artistic expression."
                    />
                  </Grid>
                  <Flex sx={{ justifyContent: 'center', mb: 'l', mt: 'l' }}>
                    <InternalInlineLink
                      href="/community-guidelines"
                      target="_blank"
                    >
                      Read our full Community Guidelines here →
                    </InternalInlineLink>
                  </Flex>

                  <Flex sx={{ justifyContent: 'center' }}>
                    <LoadingButton
                      type="submit"
                      variant="primary"
                      disabled={!isValid || !dirty}
                      isLoading={isLoading || isSuccess}
                      sx={{ borderRadius: 999, px: ['s', null, 'xl'] }}
                    >
                      I agree!
                    </LoadingButton>
                  </Flex>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>
    </Flex>
  );
}

const getStyles = () => {
  const container: ThemeUIStyleObject = {
    maxWidth: 640,
    marginX: 'auto',
    flex: 1,
    alignItems: 'center',
    paddingBottom: 's',
    px: ['s', null, 0],
  };

  const text: ThemeUIStyleObject = {
    maxWidth: 370,
    marginX: 'auto',
    textAlign: 'center',
  };

  const summary: ThemeUIStyleObject = {
    ...text,
    fontWeight: 600,
  };

  return { container, text, summary };
};

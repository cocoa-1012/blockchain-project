/** @jsxRuntime classic */
/* @jsx jsx */
import React from 'react';
import { jsx, Text, Button, Box } from 'theme-ui';
import { useState } from 'react';

import { Formik, Form } from 'formik';
import { useLocation } from 'react-use';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { useMutation } from 'react-query';

import { ModalKey } from 'types/modal';

import ModalContainer from './common/ModalContainer';
import ModalContent from './common/ModalContent';
import ModalHeading from './common/ModalHeading';
import ModalCloseButton from './ModalCloseButton';

import SpinnerStroked from 'components/SpinnerStroked';
import TextAreaField from 'components/forms/fields/TextAreaField';
import TextField from 'components/forms/fields/TextField';
import ExternalInlineLink from 'components/links/ExternalInlineLink';
import InternalInlineLink from 'components/links/InternalInlineLink';

import { useUserWithEmailByPublicKey } from 'hooks/queries/use-user-by-public-key';
import useModal from 'hooks/use-modal';

import { sendReport } from 'queries/admin/admin';

import { ReportFormSchema } from 'schemas/admin';

import {
  textAlignLeft,
  positionAbsolute,
  positionRelative,
} from 'types/styles';
import { ReportType } from 'types/Report';

interface ReportModalProps {
  publicAddress: string;
  authToken: string;
  id: string;
  type: ReportType;
}

interface ReportFormProps {
  email?: string;
  id: string;
  type: ReportType;
  onSubmit: () => void;
}

interface SubmittedProps {
  onClose: () => void;
}

function Submitted(props: SubmittedProps) {
  const { onClose } = props;
  return (
    <>
      <ModalHeading sx={{ textAlign: textAlignLeft, mx: '0', mb: 's' }}>
        Report Submitted
      </ModalHeading>
      <Text variant="body.body" sx={{ pr: 'xl', mb: 'm' }}>
        Thank you for submitting a report. Foundation's Trust and Safety team
        will review the report, and reach out to you if they need additional
        information.
      </Text>
      <Button onClick={onClose}>Close</Button>
    </>
  );
}

function ReportForm(props: ReportFormProps) {
  const { email = '', id, type, onSubmit } = props;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { href } = useLocation();
  const {
    mutateAsync: sendReportMutation,
    isLoading: sendReportLoading,
    isSuccess: sendReportSuccess,
  } = useMutation(sendReport, {
    onSettled: () => {
      onSubmit();
    },
  });

  const handleOnSubmit = async (props: {
    email: string;
    description: string;
  }) => {
    try {
      const recaptchaToken = await executeRecaptcha('report_form');
      await sendReportMutation({
        ...props,
        id,
        url: href,
        type,
        recaptchaToken,
      });
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <ModalHeading sx={{ textAlign: textAlignLeft, mx: '0', mb: 's' }}>
        Submit a report
      </ModalHeading>
      <Text variant="body.body" sx={{ pr: 'xl', mb: 'm' }}>
        If you believe there's been a violation of Foundation's{' '}
        <InternalInlineLink href="/terms">Terms of Service</InternalInlineLink>{' '}
        or{' '}
        <InternalInlineLink href="/community-guidelines">
          Community Guidelines
        </InternalInlineLink>
        , please complete this report.
      </Text>

      <Text variant="body.body" sx={{ pr: 'xl', mb: 'm' }}>
        For all cases related to potential copyright infringement, please email{' '}
        <ExternalInlineLink href="mailto:trust@withfoundation.com">
          trust@withfoundation.com
        </ExternalInlineLink>{' '}
        directly with a formal DMCA Takedown Request.
      </Text>

      <Formik
        initialValues={{
          email: email,
          description: '',
        }}
        enableReinitialize
        validationSchema={ReportFormSchema}
        onSubmit={handleOnSubmit}
      >
        <Form>
          <Box sx={{ mb: 's' }}>
            <TextField name="email" placeholder="Email address" />
          </Box>

          <Box sx={{ mb: 's' }}>
            <TextAreaField
              name="description"
              placeholder="Describe why you think this page should be removed from Foundation."
              rows={6}
            />
          </Box>

          <Button
            type="submit"
            sx={{ width: '100%' }}
            disabled={sendReportLoading || sendReportSuccess}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: positionRelative,
              }}
            >
              {(sendReportLoading || sendReportSuccess) && (
                <Box sx={{ mr: 'xs', position: positionAbsolute, left: 0 }}>
                  <SpinnerStroked size={18} />
                </Box>
              )}{' '}
              Submit
            </Box>
          </Button>
        </Form>
      </Formik>
    </>
  );
}

export default function ReportModal(props: ReportModalProps): JSX.Element {
  const { id, type, publicAddress, authToken } = props;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { currentModal, resetModal } = useModal();

  const isOpen = ModalKey.REPORT === currentModal;

  const { data: currentUserAuthData } = useUserWithEmailByPublicKey(
    isOpen && publicAddress,
    authToken
  );

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleClose = () => {
    resetModal();
  };

  return (
    <ModalContainer modalKey={ModalKey.REPORT}>
      <ModalContent sx={{ maxWidth: 500 }}>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
        >
          <ModalCloseButton />
          {isSubmitted ? (
            <Submitted onClose={handleClose} />
          ) : (
            <ReportForm
              email={currentUserAuthData?.user?.email}
              id={id}
              type={type}
              onSubmit={handleSubmit}
            />
          )}
        </GoogleReCaptchaProvider>
      </ModalContent>
    </ModalContainer>
  );
}

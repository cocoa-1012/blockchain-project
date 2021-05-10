import * as Sentry from '@sentry/node';
import { SENTRY_IGNORED_ERRORS } from 'lib/constants';

import { isProdOrStaging } from 'utils/helpers';

Sentry.init({
  enabled: isProdOrStaging,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  release: 'fnd-frontend@' + process.env.VERCEL_GITHUB_COMMIT_SHA,
  ignoreErrors: SENTRY_IGNORED_ERRORS,
});

export default Sentry;

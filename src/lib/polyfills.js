/* eslint no-extend-native: 0 */

// This file runs before React and Next.js core
// This file is loaded for all browsers
// Next.js includes a number of polyfills only for older browsers like IE11
// Make sure you don't duplicate these in this file
// https://github.com/vercel/next.js/blob/canary/packages/next-polyfill-nomodule/src/index.js

import { ResizeObserver } from '@juggle/resize-observer';
import 'intersection-observer';

// polyfill localstorage
import './localstorage-polyfill';

const noop = () => void 0;

if ('ResizeObserver' in window === false) {
  // Loads polyfill asynchronously, only if required.
  window.ResizeObserver = ResizeObserver;
}

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  // these two errors come from facebooks’s browser and clog up sentry
  window._pcmBridgeCallbackHandler = noop;
  window._AutofillCallbackHandler = noop;
}

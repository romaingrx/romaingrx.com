import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: 'https://a774901c0480ea866cee1018309f96a7@o4508797318004736.ingest.de.sentry.io/4508797320036432',
  // Set sampling rate for profiling
  profilesSampleRate: 1.0,
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Enable Debug Mode (Recommended to disable in production)
  debug: import.meta.env.DEV,
});

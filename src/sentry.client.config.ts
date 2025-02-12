import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: 'https://a774901c0480ea866cee1018309f96a7@o4508797318004736.ingest.de.sentry.io/4508797320036432',
  integrations: [
    Sentry.feedbackIntegration({
      // Configure the feedback widget
      colorScheme: 'system', // Use system color scheme
      isNameRequired: true,
      isEmailRequired: true,
      showBranding: false,
      buttonLabel: 'Send Feedback',
      submitButtonLabel: 'Send',
      messageLabel: "What's on your mind?",
      successMessageText: 'Thank you for your feedback!',
      // Customize the position of the feedback button
      buttonPosition: 'right',
      // Additional styling
      themeLight: {
        background: 'white',
        text: 'black',
        border: '#e5e7eb',
      },
      themeDark: {
        background: '#1a1a1a',
        text: 'white',
        border: '#2e2e2e',
      },
    }),
  ],
});

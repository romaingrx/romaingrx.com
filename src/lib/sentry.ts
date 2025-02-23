import * as Sentry from '@sentry/astro';

import type { ContactFormData } from '@/schemas/contact';

export async function send_feedback(data: ContactFormData) {
  const result = Sentry.captureFeedback({
    name: data.name,
    email: data.email,
    message: data.message,
  });
  return result;
}

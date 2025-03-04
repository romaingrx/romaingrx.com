import { defineAction } from 'astro:actions';

import { send_feedback } from '@/lib/sentry';
import { contactFormSchema } from '@/schemas/contact';

export const server = {
  contactFormAction: defineAction({
    input: contactFormSchema,
    async handler(data) {
      const response = await send_feedback(data);
      return response;
    },
  }),
};

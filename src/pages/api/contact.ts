import type { APIRoute } from 'astro';
import * as Sentry from '@sentry/astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Send message to Sentry
    Sentry.captureMessage(`Contact Form Message from ${name} (${email}): ${message}`, {
      level: 'info',
      tags: {
        source: 'contact_form',
        user_email: email?.toString(),
        user_name: name?.toString(),
      },
    });

    return new Response(JSON.stringify({ message: 'Message sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    return new Response(JSON.stringify({ message: 'Error sending message' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  try {
    // const formData = await request.formData();
    // const name = formData.get('name');
    // const email = formData.get('email');
    // const message = formData.get('message');

    // Submit user feedback using the feedback API
    // captureFeedback({
    //   name: name?.toString() || 'Anonymous',
    //   email: email?.toString() || 'no-email@provided.com',
    //   message: message?.toString() || '',
    // });

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

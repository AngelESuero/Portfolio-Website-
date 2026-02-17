interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

function validate(payload: ContactPayload): string[] {
  const errors: string[] = [];
  if (!payload.name || payload.name.trim().length < 2) errors.push('Name must be at least 2 characters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.push('Invalid email address.');
  if (!payload.message || payload.message.trim().length < 10) errors.push('Message must be at least 10 characters.');
  return errors;
}

export const onRequestPost: PagesFunction = async ({ request }) => {
  const contentType = request.headers.get('content-type') || '';
  let payload: ContactPayload;

  if (contentType.includes('application/json')) {
    payload = await request.json<ContactPayload>();
  } else {
    const formData = await request.formData();
    payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || '')
    };
  }

  const errors = validate(payload);
  if (errors.length > 0) {
    return new Response(JSON.stringify({ ok: false, errors }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });
  }

  console.log('Contact form submission', {
    name: payload.name,
    email: payload.email,
    messageLength: payload.message.length,
    timestamp: new Date().toISOString()
  });

  return new Response(JSON.stringify({ ok: true, message: 'Received.' }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
};

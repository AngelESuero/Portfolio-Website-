interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

function normalize(value: unknown, max = 4000): string {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function isJsonRequest(request: Request): boolean {
  return request.headers.get('content-type')?.toLowerCase().includes('application/json') ?? false;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function readPayload(request: Request): Promise<ContactPayload> {
  if (isJsonRequest(request)) {
    const body = await request.json().catch(() => ({}));
    return {
      name: normalize((body as Record<string, unknown>).name, 120),
      email: normalize((body as Record<string, unknown>).email, 256),
      message: normalize((body as Record<string, unknown>).message, 4000)
    };
  }

  const form = await request.formData();
  return {
    name: normalize(form.get('name'), 120),
    email: normalize(form.get('email'), 256),
    message: normalize(form.get('message'), 4000)
  };
}

function badRequest(message: string): Response {
  return new Response(JSON.stringify({ ok: false, message }), {
    status: 400,
    headers: jsonHeaders
  });
}

function successResponse(request: Request): Response {
  if (isJsonRequest(request)) {
    return new Response(JSON.stringify({ ok: true, message: 'Message received.' }), {
      status: 200,
      headers: jsonHeaders
    });
  }

  const redirectUrl = new URL('/contact?sent=1', request.url);
  return Response.redirect(redirectUrl.toString(), 303);
}

export const onRequestPost: PagesFunction = async ({ request }) => {
  const payload = await readPayload(request);

  if (!payload.name || !payload.email || !payload.message) {
    return badRequest('Missing required fields.');
  }

  if (!isValidEmail(payload.email)) {
    return badRequest('Invalid email address.');
  }

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const ua = normalize(request.headers.get('user-agent') || 'unknown', 256);

  console.log(
    `[contact] name="${payload.name}" email="${payload.email}" message_length=${payload.message.length} ip=${ip} ua="${ua}"`
  );

  return successResponse(request);
};

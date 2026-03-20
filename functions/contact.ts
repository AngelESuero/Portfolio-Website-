interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

interface Env {
  CONTACT_WEBHOOK_URL?: string;
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

function errorResponse(request: Request, code: 'unavailable' | 'failed', message: string, status: number): Response {
  if (isJsonRequest(request)) {
    return new Response(JSON.stringify({ ok: false, message }), {
      status,
      headers: jsonHeaders
    });
  }

  const redirectUrl = new URL(`/contact?error=${code}`, request.url);
  return Response.redirect(redirectUrl.toString(), 303);
}

async function deliverMessage(payload: ContactPayload, env: Env) {
  const webhookUrl = String(env.CONTACT_WEBHOOK_URL || '').trim();

  if (!webhookUrl) {
    return {
      ok: false as const,
      code: 'unavailable' as const,
      message: 'Contact delivery is not configured.',
      status: 503
    };
  }

  const requestId = crypto.randomUUID().slice(0, 8);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-contact-request-id': requestId
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(
        `[contact] delivery_failed request_id=${requestId} message_length=${payload.message.length} status=${response.status}`
      );

      return {
        ok: false as const,
        code: 'failed' as const,
        message: 'Contact delivery failed. Please try again later.',
        status: 502
      };
    }

    console.log(`[contact] delivered request_id=${requestId} message_length=${payload.message.length}`);

    return { ok: true as const };
  } catch {
    console.error(`[contact] delivery_failed request_id=${requestId} message_length=${payload.message.length}`);

    return {
      ok: false as const,
      code: 'failed' as const,
      message: 'Contact delivery failed. Please try again later.',
      status: 502
    };
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const payload = await readPayload(request);

  if (!payload.name || !payload.email || !payload.message) {
    return badRequest('Missing required fields.');
  }

  if (!isValidEmail(payload.email)) {
    return badRequest('Invalid email address.');
  }

  const delivery = await deliverMessage(payload, env);

  if (!delivery.ok) {
    return errorResponse(request, delivery.code, delivery.message, delivery.status);
  }

  return successResponse(request);
};

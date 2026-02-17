import { syncAgiTimeline } from '../functions/_lib/agi';

interface Env {
  AGI_KV: KVNamespace;
  X_BEARER_TOKEN: string;
  AGI_SYNC_TOKEN?: string;
}

function unauthorized(): Response {
  return new Response('Unauthorized', { status: 401 });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  });
}

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(syncAgiTimeline(env));
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return json({ ok: true });
    }

    if (url.pathname === '/sync') {
      const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
      if (!env.AGI_SYNC_TOKEN || token !== env.AGI_SYNC_TOKEN) {
        return unauthorized();
      }

      const result = await syncAgiTimeline(env);
      return json(result, result.ok ? 200 : 207);
    }

    return new Response('Not found', { status: 404 });
  }
};

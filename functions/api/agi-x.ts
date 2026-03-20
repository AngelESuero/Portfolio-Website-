import { getLatestAgiXItems, isXModuleEnabled } from '../_lib/agi';

interface Env {
  AGI_KV: KVNamespace;
  AGI_X_ENABLED?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!isXModuleEnabled(env)) {
    return new Response(JSON.stringify({ enabled: false, items: [] }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=60'
      }
    });
  }

  const items = await getLatestAgiXItems(env, 200);
  return new Response(JSON.stringify({ enabled: true, items }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60'
    }
  });
};

import { getLatestAgiItems } from '../_lib/agi';

interface Env {
  AGI_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const items = await getLatestAgiItems(env, 200);
  return new Response(JSON.stringify(items), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60'
    }
  });
};

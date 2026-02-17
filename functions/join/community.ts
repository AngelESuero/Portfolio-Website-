const textHeaders = {
  'content-type': 'text/plain; charset=utf-8',
  'cache-control': 'no-store'
};

const parseAllowedRegions = (value: string | undefined) =>
  String(value || 'NJ,NY')
    .split(',')
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);

export const onRequestGet = async ({ request, env }) => {
  const cf = request?.cf || {};
  const country = String(cf.country || '').toUpperCase();
  const regionCode = String(cf.regionCode || cf.region || '').toUpperCase();
  const allowedRegions = parseAllowedRegions(env.ALLOWED_REGION_CODES);
  const inviteUrl = String(env.COMMUNITY_DISCORD_INVITE || '').trim();

  if (!inviteUrl) {
    return new Response('Community invite is not configured.', {
      status: 500,
      headers: textHeaders
    });
  }

  const allowed = country === 'US' && regionCode && allowedRegions.includes(regionCode);

  if (!allowed) {
    return new Response(
      'Community Corner is local-only right now (NJ/NY). If you are nearby, reopen this page without a VPN. If this looks wrong, contact Angel for access.',
      {
        status: 403,
        headers: textHeaders
      }
    );
  }

  return Response.redirect(inviteUrl, 302);
};

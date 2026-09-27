/**
 * Manus MCP HTTP bridge (Vercel serverless)
 * Public-record allowlist only. Optional MCP_BRIDGE_TOKEN via env.
 */
const ALLOW = [
  'https://www.justice.gov/',
  'https://www.courtlistener.com/',
  'https://web.archive.org/',
  'https://www.govinfo.gov/',
  'https://www.sec.gov/',
];

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Bridge-Token');
}

function authorized(req) {
  const token = process.env.MCP_BRIDGE_TOKEN;
  if (!token) return true;
  const h = req.headers['x-bridge-token'] || req.headers['authorization'] || '';
  return h === token || h === `Bearer ${token}`;
}

function allowedUrl(u) {
  try {
    const url = new URL(u);
    if (url.protocol !== 'https:') return false;
    return ALLOW.some((p) => u.startsWith(p));
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const path = (req.url || '/').split('?')[0];

  if (req.method === 'GET' && (path === '/' || path === '/health' || path === '/api' || path === '/api/health')) {
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        ok: true,
        service: 'manus-mcp-bridge',
        tools: ['public_record_get', 'desk_status'],
        token_required: Boolean(process.env.MCP_BRIDGE_TOKEN),
      })
    );
  }

  if (!authorized(req)) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'unauthorized' }));
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body || '{}');
      } catch {
        body = {};
      }
    }
    body = body || {};

    // MCP-ish JSON-RPC or simple tool invoke
    const tool = body.tool || body.method || (body.params && body.params.name);
    const args = body.args || body.params?.arguments || body.params || {};

    if (tool === 'desk_status' || tool === 'tools/list') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(
        JSON.stringify({
          jsonrpc: '2.0',
          id: body.id ?? null,
          result: {
            tools: [
              { name: 'public_record_get', description: 'GET allowlisted public URL' },
              { name: 'desk_status', description: 'Status without secrets' },
            ],
            desk: 'online',
          },
        })
      );
    }

    if (tool === 'public_record_get' || tool === 'tools/call') {
      const target = args.url || args.name === 'public_record_get' && args.arguments?.url;
      const url = typeof target === 'string' ? target : args.arguments?.url || args.url;
      if (!url || !allowedUrl(url)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'url_not_allowlisted', allow: ALLOW }));
      }
      try {
        const r = await fetch(url, {
          headers: { 'User-Agent': 'manus-mcp-bridge/0.1 (public-record)' },
          redirect: 'follow',
        });
        const text = await r.text();
        res.setHeader('Content-Type', 'application/json');
        return res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            id: body.id ?? null,
            result: {
              status: r.status,
              contentType: r.headers.get('content-type'),
              body: text.slice(0, 200000),
            },
          })
        );
      } catch (e) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'upstream_failed', message: String(e.message || e) }));
      }
    }

    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'unknown_tool', tool }));
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'not_found' }));
}

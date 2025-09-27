export async function GET() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!base) {
    return new Response('Missing NEXT_PUBLIC_BACKEND_URL', { status: 500 });
  }

  try {
    const res = await fetch(`${base}/menus`, { cache: 'no-store' });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch (err: any) {
    console.error('GET /api/menus error:', err?.message || err);
    return new Response('Upstream fetch failed', { status: 500 });
  }
}

export async function POST(req: Request) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!base) return new Response('Missing NEXT_PUBLIC_BACKEND_URL', { status: 500 });

  try {
    const body = await req.json();
    const res = await fetch(`${base}/menus`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch (err: any) {
    console.error('POST /api/menus error:', err?.message || err);
    return new Response('Upstream fetch failed', { status: 500 });
  }
}

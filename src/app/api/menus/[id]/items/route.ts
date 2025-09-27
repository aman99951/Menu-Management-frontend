export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!base) return new Response('Missing NEXT_PUBLIC_BACKEND_URL', { status: 500 });

  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const res = await fetch(`${base}/menus/${id}/items`, {
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
    console.error('POST /api/menus/[id]/items error:', err?.message || err);
    return new Response('Upstream fetch failed', { status: 500 });
  }
}

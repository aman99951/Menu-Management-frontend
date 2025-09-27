import { NextRequest } from 'next/server';

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!base) return new Response('Missing NEXT_PUBLIC_BACKEND_URL', { status: 500 });

  try {
    const { id } = await ctx.params;
    const res = await fetch(`${base}/menus/${id}/tree`, { cache: 'no-store' });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch (err: any) {
    console.error('GET /api/menus/[id]/tree error:', err?.message || err);
    return new Response('Upstream fetch failed', { status: 500 });
  }
}

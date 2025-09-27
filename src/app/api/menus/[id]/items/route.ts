import { BACKEND_URL } from "../../../config";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const res = await fetch(`${BACKEND_URL}/menus/${id}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return new Response(await res.text(), { status: res.status, headers: res.headers });
}

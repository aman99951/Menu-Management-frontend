import { NextRequest } from "next/server";
import { BACKEND_URL } from "../../../config";

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 👈 must await
  const res = await fetch(`${BACKEND_URL}/menus/${id}/tree`, { cache: "no-store" });
  const text = await res.text();

  return new Response(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

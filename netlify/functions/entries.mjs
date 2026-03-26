import { getStore } from "@netlify/blobs";

export default async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 200, headers });
  }

  const store = getStore({ name: "manitou-entries", consistency: "strong" });

  if (req.method === "GET") {
    try {
      const entries = (await store.get("all-entries", { type: "json" })) || [];
      return new Response(JSON.stringify(entries), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers,
      });
    }
  }

  if (req.method === "POST") {
    try {
      const entry = await req.json();
      let entries = [];
      try {
        entries = (await store.get("all-entries", { type: "json" })) || [];
      } catch (e) {
        // First entry or corrupted data — start fresh
      }
      entry.ts = new Date().toISOString();
      entries.push(entry);
      await store.setJSON("all-entries", entries);
      return new Response(JSON.stringify({ success: true, total: entries.length }), {
        status: 200,
        headers,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers,
      });
    }
  }

  return new Response("Method not allowed", { status: 405, headers });
};

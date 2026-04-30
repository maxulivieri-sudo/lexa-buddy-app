// Conversational assistant grounded on the laws archive (RAG).
// Streams an answer with citations to relevant laws.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MODEL = "google/gemini-3-flash-preview";

type ChatMsg = { role: "user" | "assistant"; content: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json() as { messages: ChatMsg[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: "messages required" }, 400);
    }
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return json({ error: "no user message" }, 400);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI not configured" }, 500);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Retrieve all laws (only 32 — fits easily in context)
    const { data: laws } = await supabase
      .from("laws")
      .select("id, identifier, year, status, title, description, nota_operativa, areas")
      .order("year", { ascending: false });

    const archive = (laws ?? []).map((l) =>
      `[${l.identifier}] (${l.year}, ${l.status}) — ${l.title}\nAree: ${(l.areas as string[]).join(", ")}\nDescrizione: ${l.description}\nNota: ${l.nota_operativa ?? "—"}`
    ).join("\n\n");

    const system = `Sei "LexAbilis", assistente esperto della normativa italiana sulla disabilità.
Rispondi SOLO sulla base dell'ARCHIVIO LEGGI fornito qui sotto. Se la risposta non è coperta, dichiaralo apertamente e suggerisci di consultare un legale o l'ente competente — NON inventare leggi né articoli.

Stile:
- Italiano chiaro, divulgativo, MAX 200 parole.
- Markdown con elenchi puntati quando utile.
- Cita SEMPRE le leggi pertinenti tra parentesi quadre usando l'identificativo esatto, es. [Legge 104/1992], [D.Lgs. 62/2024]. Una citazione dopo ogni affermazione che la richiede.
- Non aggiungere disclaimer generici tipo "consulta un avvocato" se la risposta è chiara dall'archivio. Aggiungilo solo se la domanda esula.

ARCHIVIO LEGGI:
${archive}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429)
        return json({ error: "Troppe richieste, riprova tra poco." }, 429);
      if (aiRes.status === 402)
        return json({ error: "Crediti AI esauriti." }, 402);
      const t = await aiRes.text();
      console.error("AI error", aiRes.status, t);
      return json({ error: "AI error" }, 500);
    }

    return new Response(aiRes.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

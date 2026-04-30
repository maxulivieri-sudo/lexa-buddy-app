// Generate "Spiegamelo semplice" markdown summary for a single law, with cache.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MODEL = "google/gemini-3-flash-preview";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { law_id } = await req.json();
    if (!law_id || typeof law_id !== "string") {
      return json({ error: "law_id required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Cache hit?
    const { data: cached } = await supabase
      .from("law_summaries")
      .select("summary_md, model, created_at")
      .eq("law_id", law_id)
      .maybeSingle();
    if (cached?.summary_md) {
      return json({ summary_md: cached.summary_md, cached: true });
    }

    const { data: law, error } = await supabase
      .from("laws")
      .select("identifier, year, status, title, description, nota_operativa, areas, situazione")
      .eq("id", law_id)
      .single();
    if (error || !law) return json({ error: "Law not found" }, 404);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI not configured" }, 500);

    const userPrompt = `Spiega questa legge italiana sulla disabilità in modo chiaro e divulgativo, per un cittadino non esperto di diritto.

LEGGE: ${law.identifier} (${law.year}) — ${law.title}
STATO: ${law.status}${law.situazione ? `\nSITUAZIONE: ${law.situazione}` : ""}
AREE: ${(law.areas as string[]).join(", ")}
DESCRIZIONE UFFICIALE: ${law.description}
NOTA OPERATIVA: ${law.nota_operativa ?? "—"}

Rispondi in italiano in markdown, MAX 220 parole, con esattamente questi 4 paragrafi (titoli in **grassetto**):
**Cosa cambia**: una frase semplice.
**A chi serve**: chi ne beneficia concretamente.
**Quando si applica**: tempi e stato di vigenza.
**Cosa fare in pratica**: 2-3 azioni o riferimenti utili (uffici, moduli, procedure). Se la legge è solo principio, dillo.

Non inventare dati non presenti. Niente premesse o disclaimer.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Sei un divulgatore esperto di diritto italiano sulla disabilità. Linguaggio chiaro, niente legalese, niente disclaimer.",
          },
          { role: "user", content: userPrompt },
        ],
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

    const data = await aiRes.json();
    const summary_md: string = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!summary_md) return json({ error: "Empty response" }, 500);

    await supabase.from("law_summaries").upsert({
      law_id,
      summary_md,
      model: MODEL,
    });

    return json({ summary_md, cached: false });
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

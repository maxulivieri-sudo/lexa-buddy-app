import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Loader2, Sparkles, RotateCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AppHeader } from "@/components/mobile/AppHeader";
import { useLaws } from "@/hooks/useLaws";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Quali permessi spettano al caregiver?",
  "Come funziona il collocamento mirato?",
  "Cos'è il PEI a scuola?",
  "Come ottenere l'invalidità civile?",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-lexabilis`;

export default function ChatPage() {
  const [params] = useSearchParams();
  const lawId = params.get("law");
  const laws = useLaws();
  const focusedLaw = useMemo(() => laws?.find((l) => l.id === lawId), [laws, lawId]);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (focusedLaw && messages.length === 0) {
      setInput(`Spiegami in modo semplice la legge ${focusedLaw.identifier}`);
    }
  }, [focusedLaw]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const next = [...messages, { role: "user", content: trimmed } as Msg];
    setMessages(next);
    setLoading(true);

    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: acc } : m);
        return [...prev, { role: "assistant", content: acc }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });
      if (!resp.ok || !resp.body) {
        toast.error(resp.status === 429 ? "Troppe richieste, riprova" : "Errore assistente");
        setMessages((prev) => prev.slice(0, -1));
        return;
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":") || !line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const piece = JSON.parse(json).choices?.[0]?.delta?.content;
            if (piece) upsert(piece);
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch {
      toast.error("Connessione interrotta");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader
        title={
          <span className="flex items-center gap-1.5 justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Assistente
          </span>
        }
        right={messages.length > 0 ? (
          <button
            onClick={() => setMessages([])}
            className="h-9 w-9 rounded-full surface flex items-center justify-center"
            aria-label="Nuova conversazione"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        ) : null}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-32 pt-2 space-y-3">
        {messages.length === 0 && (
          <div className="text-center pt-10 pb-6 px-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 grid place-items-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-serif text-2xl mb-2">Come posso aiutarti?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Rispondo basandomi sulle leggi italiane in archivio.
            </p>
            <div className="space-y-2 text-left">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full text-left text-sm surface rounded-2xl px-4 py-3 active:scale-[0.99] transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] text-[15px] leading-relaxed rounded-2xl px-4 py-2.5 animate-fade-up",
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground rounded-br-md"
                : "mr-auto surface rounded-bl-md"
            )}
          >
            {m.role === "assistant" ? (
              <div className="prose-lex">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || "…"}</ReactMarkdown>
              </div>
            ) : m.content}
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="mr-auto surface rounded-2xl rounded-bl-md px-4 py-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="fixed bottom-0 left-0 right-0 glass border-t hairline px-3 py-2.5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 5.5rem)" }}
      >
        <div className="flex gap-2 items-end max-w-md mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
            }}
            rows={1}
            placeholder="Scrivi una domanda…"
            disabled={loading}
            className="flex-1 max-h-32 min-h-[44px] resize-none rounded-2xl surface px-4 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-11 w-11 rounded-full bg-primary text-primary-foreground grid place-items-center disabled:opacity-30 active:scale-95 transition"
            aria-label="Invia"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}

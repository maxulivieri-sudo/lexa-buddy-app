import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Quali permessi spettano al caregiver?",
  "Come funziona il collocamento mirato?",
  "Cos'è il PEI a scuola?",
  "Quando si applica l'European Accessibility Act?",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-lexabilis`;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: acc } : m));
        }
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
        if (resp.status === 429) {
          toast({ title: "Troppe richieste", description: "Riprova tra poco.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "Crediti AI esauriti", description: "Aggiungi credito al workspace.", variant: "destructive" });
        } else {
          toast({ title: "Errore assistente", description: `Status ${resp.status}`, variant: "destructive" });
        }
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
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const piece = parsed.choices?.[0]?.delta?.content;
            if (piece) upsert(piece);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Connessione interrotta", variant: "destructive" });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Chiudi assistente" : "Apri assistente LexAbilis"}
        className={cn(
          "fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all",
          "bg-foreground text-background hover:scale-105",
        )}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed inset-x-2 bottom-24 sm:inset-auto sm:bottom-24 sm:right-5 sm:w-[400px] z-50 max-h-[min(640px,calc(100vh-7rem))] flex flex-col bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-hero text-hero-fg flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-hero-accent/20 border border-hero-accent/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-hero-accent" />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg">Chiedi a LexAbilis</div>
              <div className="text-[11px] text-hero-muted">
                Risposte basate sulle 32 leggi in archivio
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Fai una domanda sui diritti delle persone con disabilità.
                  Esempi:
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-xs px-3 py-2 rounded-md border border-border hover:border-foreground/40 transition-colors"
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
                  "max-w-[88%] text-sm leading-relaxed rounded-2xl px-4 py-2.5",
                  m.role === "user"
                    ? "ml-auto bg-foreground text-background"
                    : "mr-auto bg-secondary text-foreground",
                )}
              >
                {m.role === "assistant" ? (
                  <div className="prose-lex">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content || "…"}
                    </ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="mr-auto bg-secondary text-foreground rounded-2xl px-4 py-2.5">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="p-3 border-t border-border bg-card flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scrivi la tua domanda…"
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm rounded-md bg-background border border-border focus:outline-none focus:border-foreground/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 rounded-md bg-foreground text-background disabled:opacity-40"
              aria-label="Invia"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}


-- Laws table: archive of Italian disability laws
CREATE TABLE public.laws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL UNIQUE,
  year INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Vigente','Parz. modificata','In attuazione')),
  situazione TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  nota_operativa TEXT,
  areas TEXT[] NOT NULL DEFAULT '{}',
  link_normattiva TEXT,
  link_normattiva_label TEXT,
  link_gazzetta TEXT,
  link_pdf TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX laws_year_idx ON public.laws(year DESC);
CREATE INDEX laws_areas_idx ON public.laws USING GIN(areas);

-- Cached "explain it simply" AI summaries per law
CREATE TABLE public.law_summaries (
  law_id UUID NOT NULL PRIMARY KEY REFERENCES public.laws(id) ON DELETE CASCADE,
  summary_md TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: laws and summaries are public read-only (no writes from clients)
ALTER TABLE public.laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.law_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Laws are publicly readable" ON public.laws
  FOR SELECT USING (true);

CREATE POLICY "Summaries are publicly readable" ON public.law_summaries
  FOR SELECT USING (true);

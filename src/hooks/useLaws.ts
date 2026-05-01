import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Law } from "@/components/lex/types";

export function useLaws() {
  const [laws, setLaws] = useState<Law[] | null>(null);
  useEffect(() => {
    supabase.from("laws").select("*").order("sort_order", { ascending: true })
      .then(({ data }) => setLaws((data ?? []) as Law[]));
  }, []);
  return laws;
}

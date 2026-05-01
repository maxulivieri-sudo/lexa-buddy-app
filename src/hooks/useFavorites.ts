import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useFavorites() {
  const { user } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setIds(new Set()); return; }
    setLoading(true);
    const { data } = await supabase.from("favorites").select("law_id").eq("user_id", user.id);
    setIds(new Set((data ?? []).map((r: { law_id: string }) => r.law_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const toggle = useCallback(async (lawId: string) => {
    if (!user) return false;
    if (ids.has(lawId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("law_id", lawId);
      setIds((s) => { const n = new Set(s); n.delete(lawId); return n; });
      return false;
    }
    await supabase.from("favorites").insert({ user_id: user.id, law_id: lawId });
    setIds((s) => new Set(s).add(lawId));
    return true;
  }, [ids, user]);

  return { ids, isFavorite: (id: string) => ids.has(id), toggle, loading, reload: load };
}

import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  notifications_enabled: boolean;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (!sess?.user) setProfile(null);
      else setTimeout(() => fetchProfile(sess.user.id), 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchProfile(data.session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function fetchProfile(uid: string) {
    const { data } = await supabase
      .from("profiles")
      .select("user_id,display_name,avatar_url,onboarding_completed,notifications_enabled")
      .eq("user_id", uid)
      .maybeSingle();
    setProfile(data as Profile | null);
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { session, user, profile, loading, refreshProfile, signOut };
}

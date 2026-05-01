import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Redirect to onboarding the first time the app is opened (or for new users
 * who haven't completed it yet). Renders nothing.
 */
export function OnboardingGate() {
  const nav = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const localDone = localStorage.getItem("lex.onboarded") === "1";
    const profileDone = profile?.onboarding_completed === true;
    if (!localDone && !profileDone && !user) {
      nav("/onboarding", { replace: true });
    } else if (user && profile && !profileDone && !localDone) {
      nav("/onboarding", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, profile]);

  return null;
}

import { Outlet, useLocation } from "react-router-dom";
import { TabBar } from "./TabBar";

const NO_TABBAR = ["/auth", "/onboarding", "/legge"];

export function AppShell() {
  const { pathname } = useLocation();
  const hideTab = NO_TABBAR.some((p) => pathname.startsWith(p));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className={`flex-1 ${hideTab ? "" : "pb-tab"}`}>
        <Outlet />
      </main>
      {!hideTab && <TabBar />}
    </div>
  );
}

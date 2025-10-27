import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { BottomNav } from "../BottomNav";

export function MainLayout() {
  return (
    <div className="h-screen flex flex-col">
      {/* Global Header - Fixed top */}
      <Header />

      {/* Main container with sidebar and content */}
      <div className="flex flex-1 pt-14">
        {/* Desktop Sidebar - Hidden on mobile */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background md:ml-20 pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <BottomNav />
    </div>
  );
}

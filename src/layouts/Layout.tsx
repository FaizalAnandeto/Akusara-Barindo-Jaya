import { createSignal } from "solid-js";
import { useLocation } from "@solidjs/router";
import Sidebar from "../components/Sidebar";
import { Navbar } from "../components";
import { useSettings } from "../contexts/SettingsContext";

const Layout = (props) => {
  const initialSidebar = (() => {
    try {
      const v = localStorage.getItem('sidebar-open');
      if (v === null) return true; // default open first time
      return v === '1';
    } catch {
      return true;
    }
  })();
  const [sidebarOpen, setSidebarOpen] = createSignal(initialSidebar);
  const location = useLocation();
  const { settings } = useSettings();

  const toggleSidebar = () => {
    setSidebarOpen((v) => {
      const next = !v;
      try { localStorage.setItem('sidebar-open', next ? '1' : '0'); } catch {}
      return next;
    });
  };

  const getActiveSection = () => {
    const pathname = location.pathname;
    if (pathname === "/dashboard" || pathname === "/") return "dashboard";
    if (pathname === "/security") return "security";
    if (pathname === "/finance") return "finance";
    if (pathname === "/osp") return "osp";
    if (pathname === "/settings") return "settings";
    if (pathname === "/profile") return "profile";
    return "dashboard";
  };

  return (
    <div 
      class={`h-screen transition-colors duration-300 ${
        settings().theme === "dark" ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      <div class="flex h-screen overflow-hidden">
        <Sidebar
          activeSection={getActiveSection}
          onToggle={toggleSidebar}
          isOpen={sidebarOpen()}
        />
        <div
          class={`flex-1 h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ${
            sidebarOpen() ? "ml-72" : "ml-16"
          }`}
        >
          {/* Global navbar for all pages */}
          <Navbar />
          {/* Page content */}
          <div class="p-8">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

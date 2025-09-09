import { createSignal } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";
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
  const navigate = useNavigate();

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

  // Client-side 2FA gate: if user logged in and backend required 2FA but session not passed, send to verify page
  createEffect(() => {
    const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let twofaRequired = false;
    try { twofaRequired = !!(userRaw && JSON.parse(userRaw)?.twofa_required); } catch {}
    // Fallback to local twofa_enabled if present
    if (!twofaRequired && typeof window !== 'undefined') {
      try { twofaRequired = localStorage.getItem('twofa_enabled') === '1'; } catch {}
    }
    const passed = typeof window !== 'undefined' ? sessionStorage.getItem('twofa_passed') === '1' : false;
    const path = location.pathname;
    const isAuthPage = path === '/signin' || path === '/signup' || path === '/forgotpw' || path === '/verify-2fa';
    if (twofaRequired && !passed && !isAuthPage) {
      navigate('/verify-2fa');
    }
  });

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

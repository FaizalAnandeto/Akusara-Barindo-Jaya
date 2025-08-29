import { createSignal } from "solid-js";
import { useLocation } from "@solidjs/router";
import Sidebar from "../components/Sidebar";

const Layout = (props) => {
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen());
  };

  const getActiveSection = () => {
    const pathname = location.pathname;
    if (pathname === "/dashboard" || pathname === "/") return "dashboard";
    if (pathname === "/osp") return "osp";
    if (pathname === "/security") return "security";
    if (pathname === "/finance") return "finance";
    if (pathname === "/settings") return "settings";
    return "dashboard";
  };

  const getCurrentPageTitle = () => {
    const activeSection = getActiveSection();
    switch (activeSection) {
      case "dashboard":
        return "Dashboard OSP Smartelco IT";
      case "osp":
        return "OSP - Report & Task Management";
      case "security":
        return "Security Management";
      case "finance":
        return "Finance Management";
      case "settings":
        return "System Settings";
      default:
        return "Dashboard OSP Smartelco IT";
    }
  };

  const getCurrentPageDescription = () => {
    const activeSection = getActiveSection();
    switch (activeSection) {
      case "dashboard":
        return "Sistem monitoring dan manajemen infrastruktur IT untuk PT Akusara Barindo Jaya";
      case "osp":
        return "Operational Support Platform untuk manajemen task, monitoring, dan reporting infrastruktur IT";
      case "security":
        return "Security monitoring, CCTV management, dan face recognition system";
      case "finance":
        return "Financial management system untuk payments dan fees";
      case "settings":
        return "User profile dan system preferences configuration";
      default:
        return "Sistem monitoring dan manajemen infrastruktur IT untuk PT Akusara Barindo Jaya";
    }
  };

  return (
    <div class="min-h-screen bg-neutral-50">
      <div class="flex min-h-screen">
        <Sidebar
          activeSection={getActiveSection}
          onToggle={toggleSidebar}
          isOpen={sidebarOpen()}
        />
        <div
          class={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${
            sidebarOpen() ? "ml-72" : "ml-16"
          }`}
        >
          <div class="bg-neutral-100 p-8 rounded-2xl mb-8 shadow-2xl border border-neutral-100">
            <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {getCurrentPageTitle()}
            </h1>
            <p class="text-neutral-600">{getCurrentPageDescription()}</p>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

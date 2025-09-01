import { createSignal } from "solid-js";
import { useLocation } from "@solidjs/router";
import Sidebar from "../components/Sidebar";
import { useSettings } from "../contexts/SettingsContext";

const Layout = (props) => {
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
  const location = useLocation();
  const { settings } = useSettings();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen());
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
      class={`min-h-screen transition-colors duration-300 ${
        settings().theme === "dark" ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
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
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

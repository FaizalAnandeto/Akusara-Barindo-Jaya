import { For } from "solid-js";
import NavigationItem from "./NavigationItem";

// Sidebar Component
const Sidebar = (props) => {
  const navItems = [
    {
      id: "dashboard",
      icon: "🏠",
      title: "Dashboard",
      subtitle: "System Overview and Summary",
    },
    { id: "osp", icon: "📊", title: "OSP", subtitle: "Report and Task" },
    {
      id: "security",
      icon: "🔒",
      title: "Security",
      subtitle: "CCTV and Face Recognition",
    },
    {
      id: "finance",
      icon: "💳",
      title: "Finance",
      subtitle: "Payments or Fees",
    },
    {
      id: "settings",
      icon: "⚙️",
      title: "Settings",
      subtitle: "User Profile and System Preferences",
    },
  ];

  return (
    <div
      class={`${
        props.isOpen ? "w-72" : "w-16"
      } bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 shadow-2xl h-screen transition-all duration-300 fixed left-0 top-0 z-40 flex flex-col border-r border-blue-800/30`}
    >
      {/* Sidebar Header with Menu Button */}
      <div class={`${props.isOpen ? "p-4" : "p-2"} mb-2 flex-shrink-0`}>
        <div
          class={`flex items-center ${
            props.isOpen ? "justify-start" : "justify-center"
          }`}
        >
          <button
            onClick={props.onToggle}
            class={`${
              props.isOpen ? "w-11 h-11" : "w-10 h-10 ml-3"
            } rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative group overflow-hidden flex-shrink-0`}
          >
            <div class="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10 w-5 h-5 flex flex-col justify-center items-center">
              <div
                class={`w-4 h-0.5 bg-white rounded-full transition-all duration-300 ${
                  props.isOpen ? "rotate-45 translate-y-0.5" : "mb-0.5"
                }`}
              ></div>
              <div
                class={`w-4 h-0.5 bg-white rounded-full transition-all duration-300 ${
                  props.isOpen ? "opacity-0 scale-0" : "mb-0.5"
                }`}
              ></div>
              <div
                class={`w-4 h-0.5 bg-white rounded-full transition-all duration-300 ${
                  props.isOpen ? "-rotate-45 -translate-y-0.5" : ""
                }`}
              ></div>
            </div>
          </button>
          <div
            class={`ml-3 transition-all duration-300 overflow-hidden ${
              props.isOpen ? "opacity-100 max-w-none" : "opacity-0 max-w-0"
            }`}
          >
            <div class="font-bold text-xl bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent whitespace-nowrap">
              Akusara
            </div>
            <div class="text-blue-300/80 text-sm font-medium whitespace-nowrap">
              Dashboard OSP
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items - Scrollable */}
      <div class="flex-1 px-2 overflow-y-auto scrollbar-hide">
        <div class="space-y-1">
          <For each={navItems}>
            {(item) => (
              <NavigationItem
                id={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                active={props.activeSection() === item.id}
                isOpen={props.isOpen}
              />
            )}
          </For>
        </div>
      </div>

      {/* Admin Panel - Fixed at bottom of sidebar */}
      <div class={`${props.isOpen ? "p-3" : "p-2"} flex-shrink-0`}>
        <div
          class={`transition-all duration-300 rounded-xl flex items-center
          ${
            props.isOpen
              ? "bg-slate-800/40 border border-slate-700/50 p-3 hover:bg-slate-800/60"
              : "justify-center p-1"
          }
        `}
        >
          <div
            class={`rounded-full bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 p-0.5 flex-shrink-0 shadow-md transition-all duration-300
            ${props.isOpen ? "w-9 h-9" : "w-10 h-10"}
          `}
          >
            <div class="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
          </div>
          <div
            class={`transition-all duration-300 overflow-hidden ${
              props.isOpen
                ? "ml-3 opacity-100 max-w-none"
                : "ml-0 opacity-0 max-w-0"
            }`}
          >
            <div class="text-white font-medium text-sm whitespace-nowrap">
              Admin
            </div>
            <div class="text-blue-200/70 text-xs whitespace-nowrap">
              Admin@app.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import { For, createSignal, onMount, onCleanup, Show } from "solid-js";
import { A } from "@solidjs/router";
import NavigationItem from "./NavigationItem";
import { useLanguage } from "../contexts/LanguageContext";
import { getStoredUser } from "../utils/auth";

// Sidebar Component
const Sidebar = (props) => {
  const { t } = useLanguage();

  const navItems = () => [
    {
      id: "dashboard",
      icon: (
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
        </svg>
      ),
      title: t("dashboard"),
      subtitle: t("systemOverview"),
    },
    {
      id: "security",
      icon: (
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
        </svg>
      ),
      title: t("security"),
      subtitle: t("cctvFaceRecognition"),
    },
    {
      id: "finance",
      icon: (
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8zM6 10a2 2 0 114 0 2 2 0 01-4 0z"></path>
        </svg>
      ),
      title: t("finance"),
      subtitle: t("paymentsOrFees"),
    },
    {
      id: "osp",
      icon: (
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
        </svg>
      ),
      title: t("osp"),
      subtitle: t("ospDescription"),
    },
    {
      id: "settings",
      icon: (
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
        </svg>
      ),
      title: t("settings"),
      subtitle: t("userProfileSystem"),
    },
  ];

  const [user, setUser] = createSignal(getStoredUser());

  onMount(() => {
    const update = () => setUser(getStoredUser());
    update();
    const onStorage = (e: StorageEvent) => { if (e.key === 'user') update(); };
    window.addEventListener('storage', onStorage);
    const onUserUpdated = () => update();
    window.addEventListener('user-updated', onUserUpdated as EventListener);
    onCleanup(() => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('user-updated', onUserUpdated as EventListener);
    });
  });

  return (
    <div
      class={`${
        props.isOpen ? "w-72" : "w-16"
      } bg-gray-900 shadow-2xl h-screen transition-all duration-300 fixed left-0 top-0 z-40 flex flex-col border-r border-gray-800`}
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
            } bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 relative group overflow-hidden flex-shrink-0`}
          >
            <div class="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
            <div class="font-bold text-xl text-white whitespace-nowrap">
              Akusara
            </div>
            <div class="text-gray-400 text-sm font-medium whitespace-nowrap">
              Dashboard OSP
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items - Scrollable */}
      <div class="flex-1 px-2 overflow-y-auto scrollbar-hide">
        <div class="space-y-1">
          <For each={navItems()}>
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

  {/* Theme and Language Controls removed (handled by Navbar) */}

      {/* Admin Panel - Fixed at bottom of sidebar */}
      <div class={`${props.isOpen ? "p-3" : "p-2"} flex-shrink-0`}>
        <A
          href="/profile"
          class={`transition-all duration-300 rounded-xl flex items-center no-underline cursor-pointer hover:bg-slate-800/60 relative group
          ${
            props.isOpen
              ? "bg-slate-800/40 border border-slate-700/50 p-3"
              : "justify-center p-1"
          }
          ${
            props.activeSection() === "profile"
              ? "bg-slate-700/60 border-slate-600"
              : ""
          }
        `}
        >
          <div
            class={`rounded-full bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 p-0.5 flex-shrink-0 shadow-md transition-all duration-300
            ${props.isOpen ? "w-9 h-9" : "w-10 h-10"}
          `}
          >
            <div class="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              <Show when={user()?.avatar} fallback={<span>{user()?.initials || (user()?.name?.[0]?.toUpperCase()) || 'U'}</span>}>
                <img src={user()?.avatar} alt="avatar" class="w-full h-full object-cover" />
              </Show>
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
              {user()?.name || 'User'}
            </div>
            <div class="text-blue-200/70 text-xs whitespace-nowrap">
              {user()?.email || user()?.username || 'user@localhost'}
            </div>
          </div>

          {/* Tooltip for collapsed state */}
          {!props.isOpen && (
            <div class="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap border border-slate-700">
              <div class="font-medium text-sm">{t('userProfile')}</div>
              <div class="text-xs text-blue-200 mt-0.5">
                {t('viewAndEditProfile')}
              </div>
              {/* Arrow */}
              <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
            </div>
          )}
        </A>
      </div>
    </div>
  );
};

export default Sidebar;

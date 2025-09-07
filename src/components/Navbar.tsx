import { createSignal, createMemo, onMount, onCleanup, For, Show } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { useLanguage } from "../contexts/LanguageContext";
import { useSettings } from "../contexts/SettingsContext";
import { searchItems } from "../search/searchIndex";
import { fetchNotifications, markNotificationRead, clearAllNotifications, type Notification as Notif } from "../services/api";
import { getStoredUser, clearStoredUser } from "../utils/auth";

const Navbar = () => {
  // Contexts for language and theme
  const { t } = useLanguage();
  const { settings, setTheme, setLanguage } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const isDark = () => settings().theme === "dark";

  const [themeSpin, setThemeSpin] = createSignal(false);
  const [idSpin, setIdSpin] = createSignal(false);
  const [enSpin, setEnSpin] = createSignal(false);

  // Realtime date/time
  const [now, setNow] = createSignal(new Date());
  const currentLang = () => settings().language;
  const locale = () => (currentLang() === "id" ? "id-ID" : "en-US");
  const dateStr = () =>
    new Intl.DateTimeFormat(locale(), {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(now());
  const timeStr = () =>
    new Intl.DateTimeFormat(locale(), {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .format(now())
      .replace(/:/g, ".");

  onMount(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    onCleanup(() => clearInterval(id as unknown as number));
  });

  // Dropdowns: notifications and profile
  const [notifOpen, setNotifOpen] = createSignal(false);
  const [profileOpen, setProfileOpen] = createSignal(false);
  const [notifs, setNotifs] = createSignal<Notif[]>([]);
  const [user, setUser] = createSignal(getStoredUser());
  const unreadCount = createMemo(() => notifs().filter(n => !n.read).length);
  const [searchOpen, setSearchOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const results = createMemo(() => searchItems(searchQuery(), 8));
  const [searchActive, setSearchActive] = createSignal(0);

  let notifBtnRef: HTMLButtonElement | undefined;
  let notifMenuRef: HTMLDivElement | undefined;
  let profileBtnRef: HTMLButtonElement | undefined;
  let profileMenuRef: HTMLDivElement | undefined;
  let searchWrapRef: HTMLDivElement | undefined;
  let searchInputRef: HTMLInputElement | undefined;
  let searchMenuRef: HTMLDivElement | undefined;

  onMount(() => {
    // Update user state on mount and when storage changes
    const updateUser = () => setUser(getStoredUser());
    updateUser();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'user') updateUser();
    };
    const onUserUpdated = () => updateUser();
    window.addEventListener('storage', onStorage);
    window.addEventListener('user-updated', onUserUpdated as EventListener);
    onCleanup(() => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('user-updated', onUserUpdated as EventListener);
    });

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        notifOpen() &&
        !notifBtnRef?.contains(target) &&
        !notifMenuRef?.contains(target)
      ) {
        setNotifOpen(false);
      }
      if (
        profileOpen() &&
        !profileBtnRef?.contains(target) &&
        !profileMenuRef?.contains(target)
      ) {
        setProfileOpen(false);
      }
      if (
        searchOpen() &&
        !searchWrapRef?.contains(target) &&
        !searchMenuRef?.contains(target)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    onCleanup(() => document.removeEventListener("click", onDocClick));
  });

  // Load notifications when opening the menu first time or on mount
  const loadNotifs = async () => {
    try {
      const data = await fetchNotifications();
      setNotifs(data);
    } catch (e) {
      console.error(e);
    }
  };
  onMount(loadNotifs);

  const toggleTheme = () => {
    setTheme(isDark() ? "light" : "dark");
    setThemeSpin(true);
    setTimeout(() => setThemeSpin(false), 500);
  };

  // currentLang defined above

  // Current page title from route
  const pageKey = () => {
    const p = location.pathname || "/";
    if (p === "/" || p === "/dashboard") return "dashboard";
    if (p.startsWith("/security")) return "security";
    if (p.startsWith("/finance")) return "finance";
    if (p.startsWith("/osp")) return "osp";
    if (p.startsWith("/settings")) return "settings";
    if (p.startsWith("/profile")) return "profile";
    // Fallback to last segment (lowercased)
    const seg = p.split("/").filter(Boolean).pop() || "dashboard";
    return seg.toLowerCase();
  };

  return (
  <nav class="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
  {/* Left accent bar - switch to blue to avoid red tones */}
  <div class="absolute left-0 top-0 h-full w-1" />

      <div class="max-w-full mx-auto px-4">
        <div class="h-16 flex items-center justify-between gap-4">
          {/* Left: Home icon, slash, page name */}
          <div class="flex items-center gap-2 text-sm">
            <svg class="h-4 w-4 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3.172 2.293 12.88a1 1 0 1 0 1.414 1.414L5 13.001V20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4h2v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6.999l1.293 1.293a1 1 0 1 0 1.414-1.414L12 3.172z" />
            </svg>
            <span class="text-gray-500 dark:text-gray-500">/</span>
            <span class="font-semibold text-gray-900 dark:text-gray-100">{t(pageKey())}</span>
          </div>

          {/* Center: pill search */}
          <div class="flex-1 flex justify-center">
            <div ref={searchWrapRef} class="relative w-full max-w-3xl">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('searchPlaceholder')}
                class="h-10 w-full rounded-full border border-gray-200 bg-white text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 pl-10 pr-4 text-sm placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 hover:border-gray-300 dark:hover:border-slate-500 transition"
                value={searchQuery()}
                onInput={(e) => {
                  const v = (e.currentTarget as HTMLInputElement).value;
                  setSearchQuery(v);
                  setSearchActive(0);
                  setSearchOpen(!!v);
                }}
                onFocus={() => {
                  if (searchQuery()) setSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  const len = results().length;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (!len) return;
                    setSearchOpen(true);
                    setSearchActive((i) => (i + 1) % len);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (!len) return;
                    setSearchOpen(true);
                    setSearchActive((i) => (i - 1 + len) % len);
                  } else if (e.key === "Enter") {
                    if (!len) return;
                    const sel = results()[Math.max(0, Math.min(searchActive(), len - 1))];
                    if (sel) {
                      navigate(sel.path);
                      setSearchOpen(false);
                      setSearchQuery("");
                      setSearchActive(0);
                      searchInputRef?.blur();
                    }
                  } else if (e.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
              />
              {/* Results dropdown */}
              <div
                ref={searchMenuRef}
                class={`absolute left-0 right-0 mt-2 origin-top rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 overflow-hidden transition-all duration-150 ${
                  searchOpen() && results().length > 0
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : searchOpen() && results().length === 0
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {results().length > 0 ? (
                  <ul class="py-1">
                    {results().map((r, idx) => (
                      <li>
                        <button
                          class={`w-full text-left px-3 py-2 flex items-center gap-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-colors ${
                            searchActive() === idx ? "bg-gray-50 dark:bg-slate-700/60" : ""
                          }`}
                          onMouseEnter={() => setSearchActive(idx)}
                          onClick={() => {
                            navigate(r.path);
                            setSearchOpen(false);
                            setSearchQuery("");
                            setSearchActive(0);
                            searchInputRef?.blur();
                          }}
                        >
                          <div class="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-gray-200 dark:border-slate-600 flex items-center justify-center">
                            <svg class="h-3.5 w-3.5 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M12 3l7 6v12h-5v-7H10v7H5V9l7-6z" />
                            </svg>
                          </div>
                          <div>
                            <div class="text-gray-900 dark:text-gray-100">{r.title}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">{r.path}</div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{t('noResults')}</div>
                )}
              </div>
            </div>
          </div>

          {/* Right: chips + bell + avatar */}
          <div class="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              class="h-10 w-10 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/80 active:scale-95 transition duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              title={isDark() ? t("switchToLight") : t("switchToDark")}
              onClick={toggleTheme}
            >
              {/* Sun/Moon icon */}
              {isDark() ? (
                // Sun icon for dark mode (to switch to light)
                <svg viewBox="0 0 24 24" class={`h-5 w-5 ${themeSpin() ? 'animate-spin' : ''}`} fill="currentColor" aria-hidden>
                  <path d="M6.76 4.84 4.95 3.03 3.54 4.44l1.81 1.82 1.41-1.42Zm10.48 0 1.41 1.42 1.81-1.82-1.41-1.41-1.81 1.81ZM12 4c.55 0 1-.45 1-1V1h-2v2c0 .55.45 1 1 1Zm0 16c-.55 0-1 .45-1 1v2h2v-2c0-.55-.45-1-1-1ZM4 13H2v-2h2v2Zm18 0h-2v-2h2v2ZM6.76 19.16l-1.41 1.41 1.59 1.59 1.41-1.41-1.59-1.59Zm10.48 0-1.59 1.59 1.41 1.41 1.59-1.59-1.41-1.41ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
                </svg>
              ) : (
                // Moon icon for light mode (to switch to dark)
                <svg viewBox="0 0 24 24" class={`h-5 w-5 ${themeSpin() ? 'animate-spin' : ''}`} fill="currentColor" aria-hidden>
                  <path d="M12.75 2.05a1 1 0 0 1 .93.24 9 9 0 1 0 8.03 8.03 1 1 0 0 1 1.17 1.17A11 11 0 1 1 12.51 1.88a1 1 0 0 1 .24.17Z" />
                </svg>
              )}
            </button>

            {/* Language flags: ID and US */}
      <div class="flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-slate-600 px-2 h-10 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <button
    class={`h-7 w-7 rounded-full overflow-hidden ring-1 transition-all duration-150 hover:ring-blue-300 active:scale-95 cursor-pointer ${
                  currentLang() === "id" ? "ring-blue-500" : "ring-transparent"
                }`}
                title="Bahasa Indonesia"
                onClick={() => { setLanguage("id"); setIdSpin(true); setTimeout(() => setIdSpin(false), 400); }}
        aria-pressed={currentLang() === "id"}
              >
                {/* Indonesia circular flag */}
                <svg viewBox="0 0 24 24" class={`h-full w-full ${idSpin() ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <mask id="mask-id-flag">
                      <rect width="24" height="24" fill="white" />
                      <circle cx="12" cy="12" r="12" fill="black" />
                    </mask>
                  </defs>
                  <g>
                    <rect width="24" height="24" fill="#FFFFFF" />
                    <rect width="24" height="12" y="0" fill="#E11D48" />
                    <g mask="url(#mask-id-flag)"></g>
                  </g>
                  <circle cx="12" cy="12" r="12" fill="none" />
                </svg>
              </button>
              <button
                class={`h-7 w-7 rounded-full overflow-hidden ring-1 transition-all duration-150 hover:ring-blue-300 active:scale-95 cursor-pointer ${
                  currentLang() === "en" ? "ring-blue-500" : "ring-transparent"
                }`}
                title="English (US)"
                onClick={() => { setLanguage("en"); setEnSpin(true); setTimeout(() => setEnSpin(false), 400); }}
                aria-pressed={currentLang() === "en"}
              >
                {/* United States circular flag (simplified) */}
                <svg viewBox="0 0 24 24" class={`h-full w-full ${enSpin() ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <mask id="mask-us-flag">
                      <rect width="24" height="24" fill="white" />
                      <circle cx="12" cy="12" r="12" fill="black" />
                    </mask>
                  </defs>
                  <g>
                    {/* Base */}
                    <rect width="24" height="24" fill="#B91C1C" />
                    {/* Stripes */}
                    <g fill="#FFFFFF">
                      <rect y="2" width="24" height="2" />
                      <rect y="6" width="24" height="2" />
                      <rect y="10" width="24" height="2" />
                      <rect y="14" width="24" height="2" />
                      <rect y="18" width="24" height="2" />
                    </g>
                    {/* Canton */}
                    <rect x="0" y="0" width="12" height="12" fill="#1E3A8A" />
                    {/* Stars as dots */}
                    <g fill="#FFFFFF">
                      <circle cx="2" cy="2" r="0.6" />
                      <circle cx="4" cy="3.5" r="0.6" />
                      <circle cx="6" cy="2" r="0.6" />
                      <circle cx="8" cy="3.5" r="0.6" />
                      <circle cx="10" cy="2" r="0.6" />
                      <circle cx="2" cy="6" r="0.6" />
                      <circle cx="4" cy="7.5" r="0.6" />
                      <circle cx="6" cy="6" r="0.6" />
                      <circle cx="8" cy="7.5" r="0.6" />
                      <circle cx="10" cy="6" r="0.6" />
                    </g>
                  </g>
                  <g mask="url(#mask-us-flag)"></g>
                  <circle cx="12" cy="12" r="12" fill="none" />
                </svg>
              </button>
            </div>
            {/* Date chip */}
            <div class="hidden md:flex items-center gap-2 rounded-full border border-gray-200 dark:border-slate-600 px-3.5 h-10 text-sm text-gray-900 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-colors">
              <div class="flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-gray-200 dark:border-slate-600">
                <svg class="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm12 8H5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8Z" />
                </svg>
              </div>
              <span class="whitespace-nowrap select-none">{dateStr()}</span>
            </div>

            {/* Time chip */}
            <div class="hidden md:flex items-center gap-2 rounded-full border border-gray-200 dark:border-slate-600 px-3.5 h-10 text-sm text-gray-900 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-colors">
              <div class="flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-gray-200 dark:border-slate-600">
                <svg class="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 5a1 1 0 0 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 1 0 1.414-1.414L13 9.586Z" />
                </svg>
              </div>
              <span class="whitespace-nowrap tabular-nums select-none">{timeStr()}</span>
            </div>

            {/* Notifications dropdown */}
      <div class="relative">
              <button
                ref={notifBtnRef}
        class="relative h-10 w-10 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/80 active:scale-95 transition duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                aria-haspopup="menu"
                aria-expanded={notifOpen()}
                onClick={async () => {
                  if (!notifOpen()) await loadNotifs();
                  setNotifOpen((v) => !v);
                }}
              >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm8-6-1.7-1.7V11a6.3 6.3 0 0 0-5-6.18V4a1.3 1.3 0 1 0-2.6 0v.82A6.3 6.3 0 0 0 6.3 11v3.3L4.6 16a1 1 0 0 0 .7 1.7h15.4a1 1 0 0 0 .7-1.7Z" />
                </svg>
                <Show when={unreadCount() > 0}>
                  <span class="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 rounded-full bg-blue-600 text-white text-[10px] leading-5 text-center">
                    {unreadCount()}
                  </span>
                </Show>
              </button>
              {/* Menu */}
              <div
                ref={notifMenuRef}
                class={`absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl ring-1 ring-black/5 p-2 transition-all duration-150 text-gray-900 dark:text-gray-100 z-50 ${
                  notifOpen() ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {/* Caret */}
                <div class="absolute -top-1 right-6 w-3 h-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rotate-45"></div>
        <div class="px-2.5 py-2 rounded-lg bg-gradient-to-r from-indigo-500/5 to-blue-500/5 border border-gray-100 dark:border-slate-700/60 mb-2">
                  <div class="flex items-center justify-between">
          <div class="text-xs font-semibold text-gray-800 dark:text-gray-300">{t('notifications')}</div>
          <div class="text-[11px] px-2 py-0.5 rounded-full bg-blue-600 text-white dark:bg-blue-500 dark:text-white border border-transparent">{unreadCount()} {t('unread')}</div>
                  </div>
                </div>
        <Show when={notifs().length > 0} fallback={<div class="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">{t('caughtUp')}</div>}>
                  <ul class="space-y-1 max-h-80 overflow-auto pr-1">
                    <For each={notifs()}>{(n) => (
                      <li>
                        <div class="group flex items-start gap-3 rounded-lg px-3 py-2 border border-transparent hover:border-gray-200 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <button
                            class="mt-0.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-offset-transparent"
                            classList={{ 'bg-blue-500 ring-blue-200': !n.read, 'bg-gray-300 ring-transparent': n.read }}
                            aria-label={n.read ? 'read' : 'unread'}
                            onClick={async () => {
                              try { await markNotificationRead(n.id); setNotifs((prev) => prev.map(x => x.id === n.id ? { ...x, read: true } : x)); } catch (e) { console.error(e); }
                            }}
                          />
                          <div class="text-sm flex-1 min-w-0">
                            <div class="text-gray-900 dark:text-gray-100 truncate font-medium">{n.title}</div>
                            <div class="text-gray-500 dark:text-gray-400 text-xs truncate">{n.description}</div>
                          </div>
                          <div class="text-[10px] text-gray-400 ml-2 whitespace-nowrap">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </li>
                    )}</For>
                  </ul>
                </Show>
                <div class="flex gap-2 mt-2">
                  <button
                    class="flex-1 text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 py-1.5 rounded-md hover:bg-blue-50/40 dark:hover:bg-blue-900/20"
                    onClick={async () => { try { await clearAllNotifications(); setNotifs((prev) => prev.map(n => ({...n, read: true}))); } catch (e) { console.error(e); } }}
                  >
                    {t('markAllAsRead')}
                  </button>
                  <button
                    class="flex-1 text-center text-sm text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white py-1.5 rounded-md hover:bg-gray-100/60 dark:hover:bg-slate-700/70"
                    onClick={() => {
                      navigate('/dashboard');
                      setNotifOpen(false);
                    }}
                  >
                    {t('viewAll')}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile dropdown */}
      <div class="relative">
              <button
                ref={profileBtnRef}
        class="h-10 w-10 rounded-full overflow-hidden bg-yellow-400 text-white text-sm font-semibold flex items-center justify-center ring-0 hover:brightness-105 active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                aria-haspopup="menu"
                aria-expanded={profileOpen()}
                onClick={() => setProfileOpen((v) => !v)}
                title="Profile"
              >
                <Show when={user()?.avatar} fallback={<span>{user()?.initials || (user()?.name?.[0]?.toUpperCase()) || 'U'}</span>}>
                  <img src={user()?.avatar} alt="avatar" class="w-full h-full object-cover" />
                </Show>
              </button>
              <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-800"></span>
              {/* Menu */}
              <div
                ref={profileMenuRef}
                class={`absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl ring-1 ring-black/5 overflow-hidden transition-all duration-150 text-gray-900 dark:text-gray-100 z-50 ${
                  profileOpen() ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {/* Caret */}
                <div class="absolute -top-1 right-6 w-3 h-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rotate-45"></div>
                {/* Header */}
                <div class="px-4 py-3 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 dark:from-indigo-400/10 dark:to-blue-400/10 border-b border-gray-100 dark:border-slate-700">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-full overflow-hidden bg-yellow-400 text-white flex items-center justify-center font-semibold ring-2 ring-yellow-200">
                      <Show when={user()?.avatar} fallback={<span>{user()?.initials || (user()?.name?.[0]?.toUpperCase()) || 'U'}</span>}>
                        <img src={user()?.avatar} alt="avatar" class="w-full h-full object-cover" />
                      </Show>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{user()?.name || 'User'}</div>
                      <div class="text-xs text-gray-700 dark:text-gray-400">{user()?.email || user()?.username || 'user@localhost'} • {user()?.role || 'User'}</div>
                    </div>
                  </div>
                </div>
                <div class="py-2">
                  <button
                    class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 font-medium"
                    onClick={() => {
                      navigate('/profile');
                      setProfileOpen(false);
                    }}
                  >
                    <svg class="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5Z" />
                    </svg>
                    {t('profile')}
                  </button>
                  <button
                    class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 font-medium"
                    onClick={() => {
                      navigate('/settings');
                      setProfileOpen(false);
                    }}
                  >
                    <svg class="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Zm-9 4a9 9 0 1 1 9 9 9.01 9.01 0 0 1-9-9Z" />
                    </svg>
                    {t('settings')}
                  </button>
                  <div class="my-1 border-t border-gray-100 dark:border-slate-700" />
                  <button
                    class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 font-medium"
                    onClick={() => {
                      clearStoredUser();
                      navigate('/signin');
                      setProfileOpen(false);
                    }}
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M16 13v-2H7V7l-5 5 5 5v-4h9Zm5-10H9a2 2 0 0 0-2 2v3h2V5h12v14H9v-3H7v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
                    </svg>
                    {t('signOut')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

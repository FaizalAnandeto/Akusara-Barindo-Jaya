import { Component, createSignal, For, Show, createEffect, onMount } from "solid-js";
import Layout from "../layouts/Layout";
import { useSettings } from "../contexts/SettingsContext";
import { useLanguage } from "../contexts/LanguageContext";
import { fetchTwoFA, setupTwoFA, verifyTwoFA, disableTwoFA, fetchQr } from "../services/twofa";

// Enhanced Card Component
const Card: Component<{ children: any; class?: string }> = (props) => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
    console.log('Settings Card theme updated to:', settings().theme);
  });
  
  return (
    <div
      class={`theme-card rounded-lg p-6 shadow-sm border transition-all duration-300 hover:shadow-md ${
        props.class || ""
      }`}
    >
      {props.children}
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch: Component<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = (props) => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
  });

  return (
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium theme-text-secondary">
        {props.label}
      </span>
      <button
        onClick={() => props.onChange(!props.checked)}
        class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          props.checked ? "bg-blue-600" : currentTheme() === 'dark' ? "bg-slate-600" : "bg-gray-300"
        }`}
      >
        <span
          class={`inline-block h-4 w-4 transform rounded-full theme-card transition-transform ${
            props.checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

// Preferences Section Component
const PreferencesSection: Component = () => {
  const { t } = useLanguage();
  const {
    settings,
    setLanguage,
    setTheme,
    updateNotifications,
    setDefaultPage,
  } = useSettings();

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings(), null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "akusara-settings.json";
    link.click();
    URL.revokeObjectURL(url);
    console.log("Settings exported");
  };

  const resetSettings = () => {
    if (confirm(t("resetConfirmation"))) {
      localStorage.removeItem("akusara-settings");
      window.location.reload();
    }
  };

  const forceLight = () => {
    console.log("Force light mode clicked");
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
    localStorage.setItem("akusara-settings", JSON.stringify({
      language: "id",
      theme: "light",
      notifications: { email: true, sms: false, push: true },
      defaultPage: "dashboard"
    }));
    setTheme("light");
  };

  return (
    <Card>
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-gradient-to-r from-purple-600 to-indigo-700 p-2 rounded-xl shadow-lg">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            class="text-white"
          >
            <path
              d="M12 8V4l3 3-3 3M12 8H4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold theme-text-primary">{t('preferences')}</h2>
          <p class="text-sm theme-text-secondary">{t('customizeExperience')}</p>
        </div>
      </div>

      <div class="space-y-6">
        {/* Language Selection */}
        <div>
          <label class="block text-sm font-medium theme-text-primary mb-3">
            {t('language')}
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage("en")}
              class={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                settings().language === "en"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "theme-border theme-card theme-text-primary hover:theme-border"
              }`}
            >
        <div class="w-6 h-4 bg-red-500 relative overflow-hidden rounded">
                <div
                  class="absolute inset-0 bg-blue-500"
                  style="clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%)"
                ></div>
                <div
          class="absolute inset-0 bg-white keep-white"
                  style="clip-path: polygon(30% 0, 70% 0, 50% 40%, 30% 40%)"
                ></div>
              </div>
              <span class="font-medium">{t('english')}</span>
            </button>
            <button
              onClick={() => setLanguage("id")}
              class={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                settings().language === "id"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "theme-border theme-card theme-text-primary hover:theme-border"
              }`}
            >
              <div class="w-6 h-4 bg-red-500 relative overflow-hidden rounded">
                <div class="absolute bottom-0 inset-x-0 h-1/2 bg-white keep-white"></div>
              </div>
              <span class="font-medium">{t('bahasa')}</span>
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <label class="block text-sm font-medium theme-text-primary mb-3">
            {t('theme')}
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("light")}
              class={`p-4 rounded-xl border-2 transition-all duration-200 ${
                settings().theme === "light"
                  ? "border-blue-500 bg-blue-50"
                  : "theme-border theme-card hover:theme-border"
              }`}
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 theme-card border-2 theme-border rounded-lg flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-yellow-500"
                  >
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                    <line
                      x1="12"
                      y1="1"
                      x2="12"
                      y2="3"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="12"
                      y1="21"
                      x2="12"
                      y2="23"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="4.22"
                      y1="4.22"
                      x2="5.64"
                      y2="5.64"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="18.36"
                      y1="18.36"
                      x2="19.78"
                      y2="19.78"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="1"
                      y1="12"
                      x2="3"
                      y2="12"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="21"
                      y1="12"
                      x2="23"
                      y2="12"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="4.22"
                      y1="19.78"
                      x2="5.64"
                      y2="18.36"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="18.36"
                      y1="5.64"
                      x2="19.78"
                      y2="4.22"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                </div>
                <span class="font-medium theme-text-primary">{t('lightMode')}</span>
              </div>
              <p class="text-xs theme-text-secondary text-left">{t('lightModeDesc')}</p>
            </button>
            <button
              onClick={() => setTheme("dark")}
              class={`p-4 rounded-xl border-2 transition-all duration-200 ${
                settings().theme === "dark"
                  ? "border-blue-500 bg-blue-50"
                  : "theme-border theme-card hover:theme-border"
              }`}
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-blue-400"
                  >
                    <path
                      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span class="font-medium theme-text-primary">{t('darkMode')}</span>
              </div>
              <p class="text-xs theme-text-secondary text-left">{t('darkModeDesc')}</p>
            </button>
          </div>
          
          {/* Debug Button - Force Light Mode */}
          <div class="mt-4">
            <button
              onClick={forceLight}
              class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              🔧 Force Light Mode (Debug)
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <label class="block text-sm font-medium theme-text-primary mb-3">
            {t('notifications')}
          </label>
          <div class="space-y-3 theme-card p-4 rounded-xl border theme-border">
            <ToggleSwitch
              checked={settings().notifications.email}
              onChange={(checked) => updateNotifications({ email: checked })}
              label={t('emailNotifications')}
            />
            <ToggleSwitch
              checked={settings().notifications.sms}
              onChange={(checked) => updateNotifications({ sms: checked })}
              label={t('smsNotifications')}
            />
            <ToggleSwitch
              checked={settings().notifications.push}
              onChange={(checked) => updateNotifications({ push: checked })}
              label={t('pushNotifications')}
            />
          </div>
        </div>

        {/* Default Page */}
        <div>
          <label class="block text-sm font-medium theme-text-primary mb-3">
            {t('defaultPageAfterLogin')}
          </label>
          <select
            value={settings().defaultPage}
            onChange={(e) => setDefaultPage(e.target.value as any)}
            class="w-full p-3 border theme-border rounded-xl theme-card theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="dashboard">{t('dashboard')}</option>
            <option value="security">{t('security')}</option>
            <option value="finance">{t('finance')}</option>
            <option value="settings">{t('settings')}</option>
          </select>
        </div>

        {/* Settings Actions */}
        <div class="flex gap-3 pt-4 border-t theme-border">
          <button
            onClick={exportSettings}
            class="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-sm flex items-center justify-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                stroke="currentColor"
                stroke-width="2"
              />
              <polyline
                points="7,10 12,15 17,10"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="12"
                y1="15"
                x2="12"
                y2="3"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            {t('exportSettings')}
          </button>
          <button
            onClick={resetSettings}
            class="flex-1 bg-gradient-to-r from-red-600 to-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-sm flex items-center justify-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <polyline
                points="23,4 23,10 17,10"
                stroke="currentColor"
                stroke-width="2"
              />
              <polyline
                points="1,20 1,14 7,14"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            {t('resetSettings')}
          </button>
        </div>
      </div>
    </Card>
  );
};

// Security Section Component
const SecuritySection: Component = () => {
  const { t } = useLanguage();
  const [twoFactorEnabled, setTwoFactorEnabled] = createSignal(false);
  const [twoFALoading, setTwoFALoading] = createSignal(false);
  const [twoFAError, setTwoFAError] = createSignal<string | null>(null);
  const [qrSvg, setQrSvg] = createSignal<string | null>(null);
  const [otpCode, setOtpCode] = createSignal("");
  const [showChangePassword, setShowChangePassword] = createSignal(false);
  const [passwordForm, setPasswordForm] = createSignal({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeSessions, setActiveSessions] = createSignal([
    {
      id: 1,
      device: "Windows PC",
      location: "Jakarta",
      lastActive: "2024-01-15 14:30",
      current: true,
    },
    {
      id: 2,
      device: "Mobile Phone",
      location: "Jakarta",
      lastActive: "2024-01-15 13:45",
      current: false,
    },
    {
      id: 3,
      device: "iPad",
      location: "Bandung",
      lastActive: "2024-01-14 09:15",
      current: false,
    },
  ]);

  const logoutSession = (sessionId: number) => {
    setActiveSessions((sessions) =>
      sessions.filter((session) => session.id !== sessionId)
    );
    console.log(`Session ${sessionId} logged out`);
  };

  const logoutAllOtherSessions = () => {
    setActiveSessions((sessions) =>
      sessions.filter((session) => session.current)
    );
    console.log("All other sessions logged out");
  };

  const handleChangePassword = (e: Event) => {
    e.preventDefault();
    const form = passwordForm();

    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (form.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    // In a real app, you would send this to your API
    console.log("Password change request:", {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
    alert("Password changed successfully!");
    setShowChangePassword(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Load initial 2FA state from backend
  onMount(async () => {
    setTwoFALoading(true);
    setTwoFAError(null);
    try {
      const s: any = await fetchTwoFA();
      setTwoFactorEnabled(!!s.enabled);
      if (s.setupPending) {
        try {
          const q = await fetchQr();
          setQrSvg(q.qr_svg);
        } catch {}
      }
    } catch (e: any) {
      console.error("Failed to load 2FA state", e);
      setTwoFAError(t("failedToLoadTwoFA") || "Failed to load 2FA state");
    } finally {
      setTwoFALoading(false);
    }
  });

  const toggle2FA = async (enabled: boolean) => {
    setTwoFALoading(true);
    setTwoFAError(null);
    try {
      if (enabled) {
        // If setup already pending, reuse existing secret and QR
        const s: any = await fetchTwoFA();
        if (s.setupPending) {
          try {
            const q = await fetchQr();
            setQrSvg(q.qr_svg);
          } catch {}
        } else {
          const setup = await setupTwoFA();
          setQrSvg(setup.qr_svg);
        }
        setTwoFactorEnabled(false);
      } else {
        await disableTwoFA();
        setTwoFactorEnabled(false);
        setQrSvg(null);
      }
    } catch (e: any) {
      console.error("Failed to update 2FA", e);
      setTwoFAError(t("failedToUpdateTwoFA") || "Failed to update 2FA");
    } finally {
      setTwoFALoading(false);
    }
  };

  const confirm2FA = async () => {
    setTwoFALoading(true);
    setTwoFAError(null);
    try {
      await verifyTwoFA(otpCode());
      const s = await fetchTwoFA();
      setTwoFactorEnabled(!!s.enabled);
      setQrSvg(null);
      setOtpCode("");
      alert("2FA verified and enabled");
    } catch (e: any) {
      const msg = e?.message === 'invalid_code' ? 'Kode 2FA salah' : e?.message === 'setup_required' ? 'Silakan scan QR terlebih dahulu' : 'Gagal verifikasi 2FA';
      setTwoFAError(msg);
    } finally {
      setTwoFALoading(false);
    }
  };

  return (
    <Card>
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-gradient-to-r from-red-600 to-rose-700 p-2 rounded-xl shadow-lg">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            class="text-white"
          >
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              fill="currentColor"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold theme-text-primary">{t('securitySettings')}</h2>
          <p class="text-sm theme-text-secondary">{t('protectYourAccount')}</p>
        </div>
      </div>

      <div class="space-y-6">
        {/* Two-Factor Authentication */}
        <div class="theme-card p-4 rounded-xl border theme-border">
          <div class="opacity-100" classList={{ 'opacity-60 pointer-events-none': twoFALoading() }}>
            <ToggleSwitch
              checked={twoFactorEnabled()}
              onChange={(val) => !twoFALoading() && toggle2FA(val)}
              label={`${t('twoFactorAuth')} · ${twoFactorEnabled() ? 'ON' : (qrSvg() ? 'SETUP' : 'OFF')}`}
            />
          </div>
          <p class="text-xs theme-text-secondary mt-2">{t('twoFactorDescription')}</p>
          {twoFALoading() && (
            <div class="mt-2 text-xs theme-text-secondary">{t('loading') || 'Loading...'}</div>
          )}
          {twoFAError() && (
            <div class="mt-2 text-xs text-red-600">{twoFAError()}</div>
          )}
          {/* Setup UI with QR and code input */}
          {qrSvg() && (
            <div class="mt-3 p-3 border rounded-lg theme-border theme-card">
              <div class="mb-2 text-sm theme-text-primary">Scan QR di aplikasi authenticator, lalu masukkan kode 6 digit:</div>
              <div class="mb-3" innerHTML={qrSvg()!} />
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="6"
                  value={otpCode()}
                  onInput={(e) => setOtpCode(e.currentTarget.value)}
                  class="w-32 p-2 border theme-border rounded-lg theme-card theme-text-primary"
                  placeholder="123456"
                />
                <button
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                  disabled={otpCode().length !== 6 || twoFALoading()}
                  onClick={confirm2FA}
                >
                  Verifikasi
                </button>
              </div>
            </div>
          )}
          {twoFactorEnabled() && (
            <div class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-700">✓ {t('twoFactorEnabledNotice')}</p>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div>
          <button
            onClick={() => setShowChangePassword(!showChangePassword())}
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                ry="2"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            {showChangePassword() ? t('cancelPasswordChange') : t('changePassword')}
          </button>

          {showChangePassword() && (
            <form
              onSubmit={handleChangePassword}
              class="mt-4 space-y-4 theme-card p-4 rounded-xl border theme-border"
            >
              <div>
                <label class="block text-sm font-medium theme-text-primary mb-2">
                  {t('currentPassword')}
                </label>
                <input
                  type="password"
                  value={passwordForm().currentPassword}
                  onInput={(e) =>
                    setPasswordForm({
                      ...passwordForm(),
                      currentPassword: e.target.value,
                    })
                  }
                  class="w-full p-3 border theme-border rounded-lg theme-card theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium theme-text-primary mb-2">
                  {t('newPassword')}
                </label>
                <input
                  type="password"
                  value={passwordForm().newPassword}
                  onInput={(e) =>
                    setPasswordForm({
                      ...passwordForm(),
                      newPassword: e.target.value,
                    })
                  }
                  class="w-full p-3 border theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minlength="8"
                />
              </div>
              <div>
                <label class="block text-sm font-medium theme-text-primary mb-2">
                  {t('confirmPassword')}
                </label>
                <input
                  type="password"
                  value={passwordForm().confirmPassword}
                  onInput={(e) =>
                    setPasswordForm({
                      ...passwordForm(),
                      confirmPassword: e.target.value,
                    })
                  }
                  class="w-full p-3 border theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minlength="8"
                />
              </div>
              <button
                type="submit"
                class="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {t('updatePassword')}
              </button>
            </form>
          )}
        </div>

        {/* Active Sessions */}
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold theme-text-primary">
              {t('activeSessions')}
            </h3>
            <button
              onClick={logoutAllOtherSessions}
              class="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {t('logoutAllOthers')}
            </button>
          </div>
          <div class="space-y-3">
            <For each={activeSessions()}>
              {(session) => (
                <div class="flex items-center justify-between p-4 theme-card rounded-xl border theme-border">
                  <div class="flex items-center gap-3">
                    <div
                      class={`w-10 h-10 rounded-full flex items-center justify-center ${
                        session.current ? "bg-green-100" : "bg-neutral-100"
                      }`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        class={
                          session.current
                            ? "text-green-600"
                            : "theme-text-secondary"
                        }
                      >
                        <rect
                          x="2"
                          y="4"
                          width="20"
                          height="16"
                          rx="2"
                          stroke="currentColor"
                          stroke-width="2"
                        />
                        <path
                          d="M6 8h12M6 12h8M6 16h4"
                          stroke="currentColor"
                          stroke-width="1"
                        />
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium theme-text-primary flex items-center gap-2">
                        {session.device}
                        {session.current && (
                          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {t('current')}
                          </span>
                        )}
                      </div>
                      <div class="text-sm theme-text-secondary">
                        {session.location} • {t('lastActive')}: {session.lastActive}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => logoutSession(session.id)}
                      class="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      {t('signOut')}
                    </button>
                  )}
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </Card>
  );
};

// System Settings Section Component (Admin Only)
const SystemSettingsSection: Component<{ isAdmin: boolean }> = (props) => {
  const { t } = useLanguage();
  const [users] = createSignal([
    {
      id: 1,
      name: "Ahmad Wijaya",
      email: "ahmad@akusara.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      email: "siti@akusara.com",
      role: "Staff",
      status: "Active",
    },
    {
      id: 3,
      name: "Budi Santoso",
      email: "budi@akusara.com",
      role: "User",
      status: "Inactive",
    },
  ]);

  const [recentLogs] = createSignal([
    {
      timestamp: "2024-01-15 14:30:25",
      action: "User login",
      user: "Ahmad Wijaya",
      status: "success",
    },
    {
      timestamp: "2024-01-15 14:15:12",
      action: "Database backup",
      user: "System",
      status: "success",
    },
    {
      timestamp: "2024-01-15 13:45:33",
      action: "Failed login attempt",
      user: "Unknown",
      status: "warning",
    },
    {
      timestamp: "2024-01-15 12:30:18",
      action: "User created",
      user: "Ahmad Wijaya",
      status: "success",
    },
    {
      timestamp: "2024-01-15 11:20:45",
      action: "System maintenance",
      user: "System",
      status: "success",
    },
  ]);

  const [lastBackup] = createSignal("2024-01-15 02:00:00");

  const performBackup = () => {
    console.log("Performing database backup...");
  };

  return (
    <Show when={props.isAdmin}>
      <Card>
        <div class="flex items-center gap-3 mb-6">
          <div class="bg-gradient-to-r from-orange-600 to-red-700 p-2 rounded-xl shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                fill="currentColor"
              />
              <circle cx="12" cy="12" r="3" stroke="white" stroke-width="2" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold theme-text-primary">{t("systemSettings")}</h2>
            <p class="text-sm theme-text-secondary">{t("adminOnlyDescription")}</p>
          </div>
        </div>

        <div class="space-y-6">
          {/* User Management */}
          <div>
            <h3 class="text-lg font-semibold theme-text-primary mb-4">
              User Management
            </h3>
            <div class="theme-card rounded-xl border theme-border overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="theme-bg-subtle">
                    <tr>
                      <th class="text-left p-4 font-medium theme-text-secondary">
                        Name
                      </th>
                      <th class="text-left p-4 font-medium theme-text-secondary">
                        Email
                      </th>
                      <th class="text-left p-4 font-medium theme-text-secondary">
                        Role
                      </th>
                      <th class="text-left p-4 font-medium theme-text-secondary">
                        Status
                      </th>
                      <th class="text-left p-4 font-medium theme-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={users()}>
                      {(user) => (
                        <tr class="border-t theme-border hover:theme-bg-subtle">
                          <td class="p-4 font-medium theme-text-primary">
                            {user.name}
                          </td>
                          <td class="p-4 theme-text-secondary">{user.email}</td>
                          <td class="p-4">
                            <span
                              class={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "Admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : user.role === "Staff"
                                  ? "bg-blue-100 text-blue-700"
                                  : "theme-bg-subtle theme-text-secondary"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td class="p-4">
                            <span
                              class={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td class="p-4">
                            <div class="flex items-center gap-2">
                              <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Edit
                              </button>
                              <button class="text-red-600 hover:text-red-700 text-sm font-medium">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Database Backup & System Maintenance */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="theme-card p-4 rounded-xl border theme-border">
              <h4 class="font-semibold theme-text-primary mb-2">
                Database Backup
              </h4>
              <p class="text-sm theme-text-secondary mb-3">
                Last backup: {lastBackup()}
              </p>
              <button
                onClick={performBackup}
                class="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-sm flex items-center justify-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="text-white"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <polyline
                    points="14,2 14,8 20,8"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="16"
                    y1="17"
                    x2="8"
                    y2="17"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <polyline
                    points="10,9 9,9 8,9"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
                Manual Backup
              </button>
            </div>
            <div class="theme-card p-4 rounded-xl border theme-border">
              <h4 class="font-semibold theme-text-primary mb-2">
                System Maintenance
              </h4>
              <p class="text-sm theme-text-secondary mb-3">
                Optimize database and clear cache
              </p>
              <button class="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-sm flex items-center justify-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="text-white"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <polyline
                    points="12,6 12,12 16,14"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
                System Maintenance
              </button>
            </div>
          </div>

          {/* Recent System Logs */}
          <div>
            <h3 class="text-lg font-semibold theme-text-primary mb-4">
              Recent System Logs
            </h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <For each={recentLogs()}>
                {(log) => (
                  <div class="flex items-center justify-between p-3 theme-card rounded-lg border theme-border text-sm">
                    <div class="flex items-center gap-3">
                      <div
                        class={`w-2 h-2 rounded-full ${
                          log.status === "success"
                            ? "bg-green-500"
                            : log.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span class="font-mono theme-text-secondary">
                        {log.timestamp}
                      </span>
                      <span class="theme-text-primary">{log.action}</span>
                    </div>
                    <span class="theme-text-secondary">{log.user}</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </Card>
    </Show>
  );
};

// Main Settings Component
const Settings: Component = () => {
  const [isAdmin] = createSignal(true);
  const { t } = useLanguage();

  return (
    <Layout activeSection="settings">
      <div class="space-y-8">
        {/* Header */}
        <Card class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold theme-text-primary mb-2">{t("settingsPreferences")}</h1>
              <p class="theme-text-secondary text-lg">
                {t("settingsDescription")}
              </p>
            </div>
            <div class="bg-blue-600 p-4 rounded-xl shadow-lg">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                class="text-white"
              >
                <path
                  d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                  fill="currentColor"
                />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1.51-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* Settings Sections */}
        <PreferencesSection />
        <SecuritySection />
        <SystemSettingsSection isAdmin={isAdmin()} />
      </div>
    </Layout>
  );
};
export default Settings;

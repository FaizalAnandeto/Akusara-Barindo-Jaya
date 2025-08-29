import { Component, createSignal, For, Show } from "solid-js";
import Layout from "../layouts/Layout";
import { useSettings } from "../contexts/SettingsContext";

// Enhanced Card Component
const Card: Component<{ children: any; class?: string }> = (props) => {
  return (
    <div
      class={`bg-neutral-100 rounded-2xl p-6 shadow-xl border border-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
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
  return (
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-neutral-700">{props.label}</span>
      <button
        onClick={() => props.onChange(!props.checked)}
        class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          props.checked ? "bg-blue-600" : "bg-neutral-300"
        }`}
      >
        <span
          class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            props.checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

// Preferences Section Component
const PreferencesSection: Component = () => {
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
    if (
      confirm(
        "Are you sure you want to reset all settings to default? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("akusara-settings");
      window.location.reload();
    }
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
          <h2 class="text-xl font-bold text-neutral-900">Preferences</h2>
          <p class="text-sm text-neutral-600">Customize your experience</p>
        </div>
      </div>

      <div class="space-y-6">
        {/* Language Selection */}
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-3">
            Language / Bahasa
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage("en")}
              class={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                settings().language === "en"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
              }`}
            >
              <div class="w-6 h-4 bg-red-500 relative overflow-hidden rounded">
                <div
                  class="absolute inset-0 bg-blue-500"
                  style="clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%)"
                ></div>
                <div
                  class="absolute inset-0 bg-white"
                  style="clip-path: polygon(30% 0, 70% 0, 50% 40%, 30% 40%)"
                ></div>
              </div>
              <span class="font-medium">English</span>
            </button>
            <button
              onClick={() => setLanguage("id")}
              class={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                settings().language === "id"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
              }`}
            >
              <div class="w-6 h-4 bg-red-500 relative overflow-hidden rounded">
                <div class="absolute bottom-0 inset-x-0 h-1/2 bg-white"></div>
              </div>
              <span class="font-medium">Indonesian</span>
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-3">
            Theme / Tema
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("light")}
              class={`p-4 rounded-xl border-2 transition-all duration-200 ${
                settings().theme === "light"
                  ? "border-blue-500 bg-blue-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-white border-2 border-neutral-200 rounded-lg flex items-center justify-center">
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
                <span class="font-medium text-neutral-900">Light Mode</span>
              </div>
              <p class="text-xs text-neutral-600 text-left">
                Bright and clean interface
              </p>
            </button>
            <button
              onClick={() => setTheme("dark")}
              class={`p-4 rounded-xl border-2 transition-all duration-200 ${
                settings().theme === "dark"
                  ? "border-blue-500 bg-blue-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-neutral-800 border-2 border-neutral-600 rounded-lg flex items-center justify-center">
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
                <span class="font-medium text-neutral-900">Dark Mode</span>
              </div>
              <p class="text-xs text-neutral-600 text-left">Easy on the eyes</p>
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-3">
            Notifications / Notifikasi
          </label>
          <div class="space-y-3 bg-white p-4 rounded-xl border border-neutral-200">
            <ToggleSwitch
              checked={settings().notifications.email}
              onChange={(checked) => updateNotifications({ email: checked })}
              label="Email Notifications"
            />
            <ToggleSwitch
              checked={settings().notifications.sms}
              onChange={(checked) => updateNotifications({ sms: checked })}
              label="SMS Notifications"
            />
            <ToggleSwitch
              checked={settings().notifications.push}
              onChange={(checked) => updateNotifications({ push: checked })}
              label="Push Notifications"
            />
          </div>
        </div>

        {/* Default Page */}
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-3">
            Default Page After Login
          </label>
          <select
            value={settings().defaultPage}
            onChange={(e) => setDefaultPage(e.target.value as any)}
            class="w-full p-3 border border-neutral-200 rounded-xl bg-white text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="dashboard">Dashboard</option>
            <option value="security">Security</option>
            <option value="finance">Finance</option>
            <option value="settings">Settings</option>
          </select>
        </div>

        {/* Settings Actions */}
        <div class="flex gap-3 pt-4 border-t border-neutral-200">
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
            Export Settings
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
            Reset to Default
          </button>
        </div>
      </div>
    </Card>
  );
};

// Security Section Component
const SecuritySection: Component = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = createSignal(false);
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

  const toggle2FA = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    if (enabled) {
      console.log("2FA enabled - in real app, show QR code setup");
      alert("2FA enabled! In a real app, you would scan a QR code.");
    } else {
      console.log("2FA disabled");
      alert("2FA disabled!");
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
          <h2 class="text-xl font-bold text-neutral-900">Security</h2>
          <p class="text-sm text-neutral-600">Protect your account</p>
        </div>
      </div>

      <div class="space-y-6">
        {/* Two-Factor Authentication */}
        <div class="bg-white p-4 rounded-xl border border-neutral-200">
          <ToggleSwitch
            checked={twoFactorEnabled()}
            onChange={toggle2FA}
            label="Two-Factor Authentication (2FA)"
          />
          <p class="text-xs text-neutral-600 mt-2">
            Add an extra layer of security to your account
          </p>
          {twoFactorEnabled() && (
            <div class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-700">
                ✓ 2FA is enabled and protecting your account
              </p>
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
            {showChangePassword()
              ? "Cancel Password Change"
              : "Change Password"}
          </button>

          {showChangePassword() && (
            <form
              onSubmit={handleChangePassword}
              class="mt-4 space-y-4 bg-white p-4 rounded-xl border border-neutral-200"
            >
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Current Password
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
                  class="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  New Password
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
                  class="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minlength="8"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm New Password
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
                  class="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minlength="8"
                />
              </div>
              <button
                type="submit"
                class="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Update Password
              </button>
            </form>
          )}
        </div>

        {/* Active Sessions */}
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-neutral-900">
              Active Sessions
            </h3>
            <button
              onClick={logoutAllOtherSessions}
              class="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout All Others
            </button>
          </div>
          <div class="space-y-3">
            <For each={activeSessions()}>
              {(session) => (
                <div class="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200">
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
                            : "text-neutral-600"
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
                      <div class="font-medium text-neutral-900 flex items-center gap-2">
                        {session.device}
                        {session.current && (
                          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div class="text-sm text-neutral-600">
                        {session.location} • Last active: {session.lastActive}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => logoutSession(session.id)}
                      class="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Logout
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
            <h2 class="text-xl font-bold text-neutral-900">System Settings</h2>
            <p class="text-sm text-neutral-600">Admin-only system management</p>
          </div>
        </div>

        <div class="space-y-6">
          {/* User Management */}
          <div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-4">
              User Management
            </h3>
            <div class="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-neutral-50">
                    <tr>
                      <th class="text-left p-4 font-medium text-neutral-700">
                        Name
                      </th>
                      <th class="text-left p-4 font-medium text-neutral-700">
                        Email
                      </th>
                      <th class="text-left p-4 font-medium text-neutral-700">
                        Role
                      </th>
                      <th class="text-left p-4 font-medium text-neutral-700">
                        Status
                      </th>
                      <th class="text-left p-4 font-medium text-neutral-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={users()}>
                      {(user) => (
                        <tr class="border-t border-neutral-100 hover:bg-neutral-50">
                          <td class="p-4 font-medium text-neutral-900">
                            {user.name}
                          </td>
                          <td class="p-4 text-neutral-600">{user.email}</td>
                          <td class="p-4">
                            <span
                              class={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "Admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : user.role === "Staff"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-neutral-100 text-neutral-700"
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
            <div class="bg-white p-4 rounded-xl border border-neutral-200">
              <h4 class="font-semibold text-neutral-900 mb-2">
                Database Backup
              </h4>
              <p class="text-sm text-neutral-600 mb-3">
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
            <div class="bg-white p-4 rounded-xl border border-neutral-200">
              <h4 class="font-semibold text-neutral-900 mb-2">
                System Maintenance
              </h4>
              <p class="text-sm text-neutral-600 mb-3">
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
            <h3 class="text-lg font-semibold text-neutral-900 mb-4">
              Recent System Logs
            </h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <For each={recentLogs()}>
                {(log) => (
                  <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-100 text-sm">
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
                      <span class="font-mono text-neutral-600">
                        {log.timestamp}
                      </span>
                      <span class="text-neutral-900">{log.action}</span>
                    </div>
                    <span class="text-neutral-600">{log.user}</span>
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

  return (
    <Layout activeSection="settings">
      <div class="space-y-8">
        {/* Header */}
        <div class="bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-700 rounded-2xl p-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">Settings & Preferences</h1>
              <p class="text-slate-100 text-lg">
                Kelola pengaturan akun, preferensi sistem, dan konfigurasi aplikasi
              </p>
            </div>
            <div class="text-6xl opacity-20">
              <svg
                width="64"
                height="64"
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
        </div>

        {/* Settings Sections */}
        <PreferencesSection />
        <SecuritySection />
        <SystemSettingsSection isAdmin={isAdmin()} />
      </div>
    </Layout>
  );
};export default Settings;

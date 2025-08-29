import { Component, createSignal, For, Show } from "solid-js";
import Layout from "../layouts/Layout";
import { useSettings } from "../contexts/SettingsContext";

// Enhanced Card Component
const Card: Component<{ children: any; class?: string }> = (props) => {
  return (
    <div
      class={`bg-white rounded-2xl p-6 shadow-xl border border-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        props.class || ""
      }`}
    >
      {props.children}
    </div>
  );
};

// User Information Section
const UserInformationSection: Component = () => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [userInfo, setUserInfo] = createSignal({
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@akusara.com",
    phone: "+62 812-3456-7890",
    role: "Admin",
    joinDate: "15 January 2023",
    lastLogin: "Today, 14:30 WIB",
    avatar: "/api/placeholder/120/120",
  });

  const [editForm, setEditForm] = createSignal({
    name: userInfo().name,
    email: userInfo().email,
    phone: userInfo().phone,
  });

  const handleSaveProfile = () => {
    setUserInfo({ ...userInfo(), ...editForm() });
    setIsEditing(false);
    console.log("Profile updated:", editForm());
  };

  const handleAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setUserInfo({ ...userInfo(), avatar: result });
          console.log("Avatar uploaded successfully");
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <Card>
      <div class="flex items-start gap-6">
        {/* Avatar Section */}
        <div class="flex-shrink-0">
          <div class="relative group">
            <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 p-1 shadow-xl">
              <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold text-indigo-600 overflow-hidden">
                <img
                  src={userInfo().avatar}
                  alt="Profile"
                  class="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallback = target.nextElementSibling as HTMLElement;
                    target.style.display = "none";
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div
                  class="w-full h-full items-center justify-center text-4xl font-bold text-indigo-600"
                  style="display: none;"
                >
                  {userInfo().name.charAt(0)}
                </div>
              </div>
            </div>
            <button
              onClick={handleAvatarUpload}
              class="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle
                  cx="12"
                  cy="13"
                  r="4"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div class="flex-1">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold text-neutral-900 mb-1">
                {userInfo().name}
              </h1>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-sm font-medium">
                  {userInfo().role}
                </span>
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <span class="text-sm text-green-600 font-medium">Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing())}
              class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white     px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              {isEditing() ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {isEditing() ? (
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm().name}
                  onInput={(e) =>
                    setEditForm({ ...editForm(), name: e.target.value })
                  }
                  class="w-full p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 bg-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm().email}
                  onInput={(e) =>
                    setEditForm({ ...editForm(), email: e.target.value })
                  }
                  class="w-full p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 bg-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm().phone}
                  onInput={(e) =>
                    setEditForm({ ...editForm(), phone: e.target.value })
                  }
                  class="w-full p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 bg-white"
                />
              </div>
              <div class="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  class="bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  class="bg-neutral-300 text-neutral-700 px-6 py-2 rounded-xl font-medium hover:bg-neutral-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-neutral-500"
                  >
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  <div>
                    <p class="text-sm text-neutral-600">Email</p>
                    <p class="font-medium text-neutral-900">
                      {userInfo().email}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-neutral-500"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  <div>
                    <p class="text-sm text-neutral-600">Phone</p>
                    <p class="font-medium text-neutral-900">
                      {userInfo().phone}
                    </p>
                  </div>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-neutral-500"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="6"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="8"
                      y1="2"
                      x2="8"
                      y2="6"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <line
                      x1="3"
                      y1="10"
                      x2="21"
                      y2="10"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  <div>
                    <p class="text-sm text-neutral-600">Join Date</p>
                    <p class="font-medium text-neutral-900">
                      {userInfo().joinDate}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-neutral-500"
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
                  <div>
                    <p class="text-sm text-neutral-600">Last Login</p>
                    <p class="font-medium text-neutral-900">
                      {userInfo().lastLogin}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Activity Summary Section
const ActivitySummarySection: Component = () => {
  const [activityData] = createSignal({
    tasksCompleted: 45,
    tasksPending: 8,
    reportsSubmitted: 32,
    lastActivity: "2 minutes ago",
    monthlyTarget: 60,
    monthlyProgress: 45,
  });

  const [recentActivities] = createSignal([
    {
      id: 1,
      action: "Completed security inspection",
      location: "Building A - Floor 3",
      time: "2 minutes ago",
      type: "task",
    },
    {
      id: 2,
      action: "Submitted weekly report",
      location: "System Dashboard",
      time: "1 hour ago",
      type: "report",
    },
    {
      id: 3,
      action: "Updated camera configuration",
      location: "CCTV Room",
      time: "3 hours ago",
      type: "maintenance",
    },
    {
      id: 4,
      action: "Resolved access control issue",
      location: "Main Entrance",
      time: "5 hours ago",
      type: "task",
    },
    {
      id: 5,
      action: "Conducted safety briefing",
      location: "Conference Room",
      time: "1 day ago",
      type: "meeting",
    },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            class="text-green-600"
          >
            <path
              d="M9 11l3 3L22 4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      case "report":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            class="text-blue-600"
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
          </svg>
        );
      case "maintenance":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            class="text-orange-600"
          >
            <path
              d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        );
      default:
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            class="text-purple-600"
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
        );
    }
  };

  const progressPercentage = () =>
    Math.min(
      (activityData().monthlyProgress / activityData().monthlyTarget) * 100,
      100
    );

  return (
    <Card>
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-gradient-to-r from-green-600 to-emerald-700 p-2 rounded-xl shadow-lg">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            class="text-white"
          >
            <path
              d="M9 11l3 3L22 4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-neutral-900">Activity Summary</h2>
          <p class="text-sm text-neutral-600">Your performance overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-green-700">
                {activityData().tasksCompleted}
              </p>
              <p class="text-sm text-green-600">Tasks Completed</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                class="text-green-600"
              >
                <path
                  d="M9 11l3 3L22 4"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-orange-700">
                {activityData().tasksPending}
              </p>
              <p class="text-sm text-orange-600">Tasks Pending</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                class="text-orange-600"
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
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-blue-700">
                {activityData().reportsSubmitted}
              </p>
              <p class="text-sm text-blue-600">Reports Submitted</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                class="text-blue-600"
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
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Progress */}
      <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100 mb-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-purple-900">Monthly Progress</h3>
          <span class="text-sm text-purple-600">
            {activityData().monthlyProgress} / {activityData().monthlyTarget}{" "}
            tasks
          </span>
        </div>
        <div class="w-full bg-purple-200 rounded-full h-3 mb-2">
          <div
            class="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={`width: ${progressPercentage()}%`}
          ></div>
        </div>
        <p class="text-xs text-purple-600">
          {progressPercentage().toFixed(1)}% of monthly target completed
        </p>
      </div>

      {/* Recent Activities Timeline */}
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-neutral-900">
            Recent Activities
          </h3>
          <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div class="space-y-3 max-h-64 overflow-y-auto">
          <For each={recentActivities()}>
            {(activity, index) => (
              <div class="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                <div class="flex-shrink-0 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-neutral-900 text-sm">
                    {activity.action}
                  </p>
                  <p class="text-xs text-neutral-600 mt-0.5">
                    {activity.location}
                  </p>
                  <p class="text-xs text-neutral-500 mt-1">{activity.time}</p>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </Card>
  );
};

// Account Security Section
const AccountSecuritySection: Component = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = createSignal(true);
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
      browser: "Chrome 118",
      location: "Jakarta",
      lastActive: "Active now",
      current: true,
      ip: "192.168.1.100",
    },
    {
      id: 2,
      device: "Android Phone",
      browser: "Chrome Mobile",
      location: "Jakarta",
      lastActive: "30 minutes ago",
      current: false,
      ip: "192.168.1.101",
    },
    {
      id: 3,
      device: "iPad Pro",
      browser: "Safari",
      location: "Bandung",
      lastActive: "2 hours ago",
      current: false,
      ip: "192.168.1.102",
    },
  ]);

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

  const logoutSession = (sessionId: number) => {
    setActiveSessions((sessions) =>
      sessions.filter((session) => session.id !== sessionId)
    );
    alert(`Session ${sessionId} logged out successfully!`);
  };

  const logoutAllOtherSessions = () => {
    setActiveSessions((sessions) =>
      sessions.filter((session) => session.current)
    );
    alert("All other sessions logged out successfully!");
  };

  const toggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled());
    if (!twoFactorEnabled()) {
      alert("2FA enabled! In a real app, you would scan a QR code.");
    } else {
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
          <h2 class="text-xl font-bold text-neutral-900">Account Security</h2>
          <p class="text-sm text-neutral-600">Protect your account and data</p>
        </div>
      </div>

      <div class="space-y-6">
        {/* Security Overview */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-green-50 p-4 rounded-xl border border-green-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="text-green-600"
                >
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-green-800">Security Score</h3>
                <p class="text-2xl font-bold text-green-700">95%</p>
                <p class="text-xs text-green-600">Excellent security level</p>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="text-blue-600"
                >
                  <path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-blue-800">Active Sessions</h3>
                <p class="text-2xl font-bold text-blue-700">
                  {activeSessions().length}
                </p>
                <p class="text-xs text-blue-600">Devices connected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div class="bg-white p-4 rounded-xl border border-neutral-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class={`w-10 h-10 rounded-full flex items-center justify-center ${
                  twoFactorEnabled() ? "bg-green-100" : "bg-neutral-100"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  class={
                    twoFactorEnabled() ? "text-green-600" : "text-neutral-600"
                  }
                >
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M21 2l-2 2m-7.61 18.75a2.74 2.74 0 0 1-.57-.07A7.65 7.65 0 0 1 8 15v-5a6 6 0 0 1 6-6 6 6 0 0 1 6 6v5a7.65 7.65 0 0 1-2.82 7.68 2.74 2.74 0 0 1-.57.07h-5.22z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-900">
                  Two-Factor Authentication
                </h3>
                <p class="text-sm text-neutral-600">
                  {twoFactorEnabled()
                    ? "Enhanced security is enabled"
                    : "Add an extra layer of security"}
                </p>
              </div>
            </div>
            <button
              onClick={toggle2FA}
              class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                twoFactorEnabled() ? "bg-green-600" : "bg-neutral-300"
              }`}
            >
              <span
                class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled() ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
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

          <Show when={showChangePassword()}>
            <form
              onSubmit={handleChangePassword}
              class="mt-4 space-y-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200"
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
                  class="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 bg-white"
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
                  class="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 bg-white"
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
                  class="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-900 bg-white"
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
          </Show>
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
                <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div class="flex items-center gap-4">
                    <div
                      class={`w-12 h-12 rounded-full flex items-center justify-center ${
                        session.current ? "bg-green-100" : "bg-neutral-100"
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
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
                            Current Session
                          </span>
                        )}
                      </div>
                      <div class="text-sm text-neutral-600">
                        {session.browser} • {session.location}
                      </div>
                      <div class="text-xs text-neutral-500">
                        {session.lastActive} • IP: {session.ip}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => logoutSession(session.id)}
                      class="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
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

// Main Profile Component
const Profile: Component = () => {
  return (
    <Layout activeSection="profile">
      <div class="space-y-8">
        {/* Header */}
        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 rounded-2xl p-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">User Profile</h1>
              <p class="text-indigo-100 text-lg">
                Kelola informasi pribadi, aktivitas, dan keamanan akun Anda
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
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <UserInformationSection />
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ActivitySummarySection />
          <AccountSecuritySection />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

import { createSignal, onMount, For, Show, createEffect } from "solid-js";
import { useSettings } from "../contexts/SettingsContext";
import { useLanguage } from "../contexts/LanguageContext";
import Layout from "../layouts/Layout";

// Status Badge Component
const StatusBadge = (props) => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
  });

  const getStatusClass = () => {
    const isDark = currentTheme() === 'dark';
    switch (props.status) {
      case "online":
        return isDark ? "bg-emerald-900/50 text-emerald-400" : "bg-accent-emerald/20 text-accent-emerald";
      case "offline":
        return isDark ? "bg-rose-900/50 text-rose-400" : "bg-accent-rose/20 text-accent-rose";
      case "maintenance":
        return isDark ? "bg-amber-900/50 text-amber-400" : "bg-accent-amber/20 text-accent-amber";
      default:
        return isDark ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = () => {
    switch (props.status) {
      case "online":
        return props.activeText || "Active";
      case "offline":
        return "Offline";
      case "maintenance":
        return "In Progress";
      default:
        return "Unknown";
    }
  };

  return (
    <span
      class={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}
    >
      {getStatusText()}
    </span>
  );
};

// Progress Bar Component
const ProgressBar = (props) => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
  });

  return (
    <div class="my-5">
      <div class="text-sm theme-text-tertiary mb-2">{props.label}</div>
      <div class={`w-full h-2 ${currentTheme() === 'dark' ? 'bg-slate-600' : 'bg-gray-100'} rounded-full overflow-hidden`}>
        <div
          class="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
          style={`width: ${props.value}%;`}
        ></div>
      </div>
      <div class="text-sm theme-text-tertiary mt-1">{props.value}%</div>
    </div>
  );
};

// Card Component
const Card = (props) => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
    console.log('Card theme updated to:', settings().theme);
  });
  
  return (
    <div
      class={`theme-card rounded-lg p-6 shadow-sm border transition-all duration-300 hover:shadow-md relative overflow-hidden group`}
    >
      <div class="relative z-10">
        {props.children}
      </div>
    </div>
  );
};

// Camera Monitoring Component
const CameraMonitoring = () => {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
  });

  const [detectedResidents, setDetectedResidents] = createSignal(3);
  const [isRecording, setIsRecording] = createSignal(true);

  const openAllCameras = () => {
    alert(
      "Opening all camera feeds...\n\nCamera 1: Main Entrance\nCamera 2: Server Room\nCamera 3: Office Area"
    );
  };

  return (
    <Card>
      <div class="flex justify-between items-center mb-5">
        <div>
          <div class="text-lg font-bold theme-text-primary mb-1 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 000 2h8a1 1 0 100-2H5z"></path>
            </svg>
            {t('cameraMonitoring')}
          </div>
          <div class="text-sm theme-text-secondary">
            {detectedResidents()} {t('residentsDetected')}
          </div>
        </div>
        <StatusBadge
          status={isRecording() ? "online" : "offline"}
          activeText={t('recording')}
        />
      </div>
      <div class={`w-full h-48 ${currentTheme() === 'dark' ? 'bg-slate-900' : 'bg-gray-800'} rounded-lg flex items-center justify-center text-white text-sm mb-4 relative`}>
        <Show when={isRecording()}>
          <div class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs animate-pulse">
            ● REC
          </div>
        </Show>
        <svg class="w-12 h-12 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 000 2h8a1 1 0 100-2H5z"></path>
        </svg>
        {t('liveFeed')} {isRecording() ? t('active') : t('inactive')}
      </div>
      <button
        class="bg-blue-600 text-white px-5 py-2 rounded-lg 
          font-medium transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={openAllCameras}
      >
        {t('openAllCameras')}
      </button>
    </Card>
  );
};

// Smart Clustering Component
const SmartClustering = () => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
  });

  const [smartClusteringStatus] = createSignal([
    { name: "Face Recognition", status: "online" },
    { name: "Auto Clustering", status: "online" },
    { name: "CCTV Integration", status: "online" },
    { name: "Super App Integration", status: "maintenance" },
  ]);

  return (
    <Card>
      <div class="text-lg font-bold theme-text-primary mb-1 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" clip-rule="evenodd"></path>
        </svg>
        Smart Clustering Status
      </div>
      <div class="text-sm theme-text-secondary mb-5">
        Otomatisasi berdasarkan pengenalan wajah
      </div>
      <ul class="space-y-2">
        <For each={smartClusteringStatus()}>
          {(item) => (
            <li class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-600">
              <span class="theme-text-tertiary">{item.name}</span>
              <StatusBadge status={item.status} />
            </li>
          )}
        </For>
      </ul>
    </Card>
  );
};

// System Performance Component
const SystemPerformance = () => {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
  });

  const [systemMetrics, setSystemMetrics] = createSignal({
    cpu: 45,
    memory: 68,
    storage: 32,
  });

  onMount(() => {
    const interval = setInterval(() => {
      setSystemMetrics({
        cpu: Math.floor(Math.random() * 30) + 40,
        memory: Math.floor(Math.random() * 30) + 50,
        storage: Math.floor(Math.random() * 20) + 25,
      });
    }, 30000);

    return () => clearInterval(interval);
  });

  return (
    <Card>
      <div class="text-lg font-bold theme-text-primary mb-1 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        {t('systemPerformance')}
      </div>
      <div class="text-sm theme-text-secondary mb-5">{t('realtimeSystemMonitoring')}</div>
      <ProgressBar label={t('cpuUsage')} value={systemMetrics().cpu} />
      <ProgressBar label={t('memoryUsage')} value={systemMetrics().memory} />
      <ProgressBar label={t('storage')} value={systemMetrics().storage} />
    </Card>
  );
};

// OSP Management Component
const OSPManagement = () => {
  const { t } = useLanguage();
  const [activeTasks] = createSignal(24);
  const [ospTasks] = createSignal([
    { name: "Kantor ABJ Integration", status: "online" },
    { name: "Tech Solution Updates", status: "maintenance" },
    { name: "Network Scheduling", status: "online" },
  ]);

  return (
    <Card>
      <div class="text-lg font-bold theme-text-primary mb-1 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
        </svg>
        {t('ospManagement')}
      </div>
      <div class="text-sm theme-text-secondary mb-5">{t('operationalSupportPlatform')}</div>
      <div class="text-3xl font-bold theme-text-primary my-3">{activeTasks()}</div>
      <div class="text-sm theme-text-secondary mb-5">{t('activeTasks2')}</div>
      <ul class="space-y-2">
        <For each={ospTasks()}>
          {(item) => (
            <li class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-600">
              <span class="theme-text-tertiary">{item.name}</span>
              <StatusBadge status={item.status} activeText="Connected" />
            </li>
          )}
        </For>
      </ul>
    </Card>
  );
};

// Network Status Component
const NetworkStatus = () => {
  const { t } = useLanguage();
  const [networkStatus, setNetworkStatus] = createSignal({
    uptime: 98.5,
    latency: 145,
    bandwidth: 72,
  });

  onMount(() => {
    const interval = setInterval(() => {
      setNetworkStatus((prev) => ({
        ...prev,
        latency: Math.floor(Math.random() * 50) + 120,
        bandwidth: Math.floor(Math.random() * 20) + 65,
      }));
    }, 30000);

    return () => clearInterval(interval);
  });

  return (
    <Card>
      <div class="text-lg font-bold theme-text-primary mb-1 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd"></path>
        </svg>
        {t('networkStatus')}
      </div>
      <div class="text-sm theme-text-secondary mb-5">
        {t('connectivityBandwidthMonitoring')}
      </div>
      <div class="grid grid-cols-2 gap-5 my-5">
        <div>
          <div class="text-2xl font-bold theme-text-primary">
            {networkStatus().uptime}%
          </div>
          <div class="text-sm theme-text-tertiary">{t('uptime')}</div>
        </div>
        <div>
          <div class="text-2xl font-bold theme-text-primary">
            {networkStatus().latency}ms
          </div>
          <div class="text-sm theme-text-tertiary">{t('latency')}</div>
        </div>
      </div>
      <div class="text-sm theme-text-tertiary mb-2">{t('bandwidthUsage')}</div>
      <div class="w-full h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden mb-2">
        <div
          class="h-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full transition-all duration-300"
          style={`width: ${networkStatus().bandwidth}%;`}
        ></div>
      </div>
      <div class="text-sm theme-text-tertiary">
        {networkStatus().bandwidth}% {t('of1Gbps')}
      </div>
    </Card>
  );
};

// Recent Activities Component
const RecentActivities = () => {
  const { t } = useLanguage();
  const [recentActivities] = createSignal([
    { activity: "Face detected - Security cam 1", time: "2 min ago" },
    { activity: "OSP task completed", time: "15 min ago" },
    { activity: "System backup completed", time: "1 hour ago" },
    { activity: "New device connected", time: "2 hours ago" },
  ]);

  return (
    <Card>
      <div class="text-lg font-bold theme-text-primary mb-1 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
        {t('recentActivitiesDash')}
      </div>
      <div class="text-sm theme-text-secondary mb-5">
        {t('latestSystemEventsUpdates')}
      </div>
      <ul class="space-y-2">
        <For each={recentActivities()}>
          {(activity) => (
            <li class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
              <span class="theme-text-tertiary">{activity.activity}</span>
              <span class="text-xs theme-text-tertiary">{activity.time}</span>
            </li>
          )}
        </For>
      </ul>
    </Card>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  return (
    <div class="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-5 mb-8">
      <CameraMonitoring />
      <SmartClustering />
      <SystemPerformance />
      <OSPManagement />
      <NetworkStatus />
      <RecentActivities />
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div class="space-y-8">
        {/* Header */}
        <div class="theme-card rounded-lg p-8 mb-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold theme-text-primary mb-2">{t("dashboard")}</h1>
              <p class="theme-text-secondary text-lg">
                {t("systemOverview")}
              </p>
            </div>
            <div class="text-gray-300 dark:text-slate-500">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                class="text-blue-600 dark:text-blue-400"
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <line
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <line
                  x1="8"
                  y1="2"
                  x2="8"
                  y2="6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <line
                  x1="3"
                  y1="10"
                  x2="21"
                  y2="10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <DashboardContent />
      </div>
    </Layout>
  );
};

export default Dashboard;

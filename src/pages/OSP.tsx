import { createSignal, onMount, For, Show, createEffect } from "solid-js";
import { useSettings } from "../contexts/SettingsContext";
import Layout from "../layouts/Layout";
import { useLanguage } from "../contexts/LanguageContext";

// Status Badge Component
const StatusBadge = (props) => {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
  });

  const getStatusText = () => {
    switch (props.status.toLowerCase()) {
      case "active":
        return t("activeStatus");
      case "pending":
        return t("pendingStatus");
      case "idle":
        return t("idleStatus");
      case "completed":
        return t("completedStatus");
      case "done":
        return t("doneStatus");
      case "review":
        return t("reviewStatus");
      case "in progress":
        return t("inProgressStatus");
      case "online":
        return t("onlineStatus");
      case "maintenance":
        return t("maintenanceStatus");
      case "connected":
        return t("connectedStatus");
      default:
        return props.status;
    }
  };

  const getStatusClass = () => {
    switch (props.status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Idle":
        return "theme-bg-subtle theme-text-secondary";
      case "Completed":
        return "bg-blue-100 text-blue-600";
      default:
        return "theme-bg-subtle theme-text-secondary";
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

// Card Component
const Card = (props) => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
    console.log('OSP Card theme updated to:', settings().theme);
  });
  
  return (
    <div
      class="theme-card rounded-lg p-6 shadow-sm border transition-all duration-300 hover:shadow-md relative overflow-hidden group"
    >
      <div class="relative z-10">
        {props.children}
      </div>
    </div>
  );
};

// Task Overview Component
const TaskOverview = () => {
  const { t } = useLanguage();
  const [taskStats] = createSignal({
    active: 12,
    completed: 45,
    additional: 5,
  });

  return (
    <Card>
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl shadow-sm">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div>
          <div class="text-xl font-bold theme-text-primary font-display">
            {t('taskOverview')}
          </div>
          <div class="text-sm theme-text-secondary">
            {t('currentTaskStatistics')}
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex justify-between items-center p-4 theme-card rounded-lg border">
          <span class="theme-text-secondary font-medium">{t('activeTasks')}</span>
          <span class="text-3xl font-bold text-blue-600 dark:text-blue-400 font-poppins">
            {taskStats().active}
          </span>
        </div>
        <div class="flex justify-between items-center p-4 theme-card rounded-lg border">
          <span class="theme-text-secondary font-medium">{t('completedTasks')}</span>
          <span class="text-3xl font-bold text-green-600 font-poppins">
            {taskStats().completed}
          </span>
        </div>
        <div class="flex justify-between items-center p-4 theme-card rounded-lg border">
          <span class="theme-text-secondary font-medium">{t('additionalTasks')}</span>
          <span class="text-3xl font-bold text-orange-600 dark:text-orange-400 font-poppins">
            {taskStats().additional}
          </span>
        </div>
      </div>

      <div class="mt-6">
        <button
          class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg 
          font-semibold transition-all duration-300 hover:bg-blue-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span class="flex items-center justify-center gap-2">
            <span>+</span>
            <span>{t('addNewTask')}</span>
          </span>
        </button>
      </div>
    </Card>
  );
};

// Task List Component
const TaskList = () => {
  const { t } = useLanguage();
  const [tasks] = createSignal([
    {
      id: "01",
      name: t("installCCTV"),
      assignedTo: t("johnDoe"),
      status: "Active",
    },
    {
      id: "02",
      name: t("checkFiberOptic"),
      assignedTo: "Sarah L.",
      status: "Pending",
    },
    { id: "03", name: t("repairRouter"), assignedTo: t("davidP"), status: "Done" },
    {
      id: "04",
      name: t("extraWorkPhoto"),
      assignedTo: t("unknown"),
      status: "Review",
    },
  ]);

  const [filters] = createSignal({
    status: t("all"),
    date: t("all"),
    technician: t("all"),
  });

  return (
    <Card>
      <div class="text-lg font-semibold theme-text-primary mb-1 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        {t('taskList')}
      </div>
      <div class="text-sm theme-text-secondary mb-5">
        {t('manageAndTrackAllTasks')}
      </div>

      {/* Search and Filters */}
      <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
        <div class="flex flex-wrap gap-3 items-center">
          <div class="flex items-center gap-2">
            <span class="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t('searchTask')}
            </span>
            <span class="text-blue-800 dark:text-blue-300 font-semibold">{t('task')}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-blue-600 dark:text-blue-400">{t('filterLabel')}</span>
            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-300 rounded text-sm">
              [{t('statusFilter')} ▼]
            </span>
            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-300 rounded text-sm">
              [{t('dateFilter')} ▼]
            </span>
            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-300 rounded text-sm">
              [{t('technicianFilter')} ▼]
            </span>
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b theme-border">
              <th class="text-left py-3 px-2 theme-text-secondary font-medium">
                #
              </th>
              <th class="text-left py-3 px-2 theme-text-secondary font-medium">
                {t('taskName')}
              </th>
              <th class="text-left py-3 px-2 theme-text-secondary font-medium">
                {t('assignedTo')}
              </th>
              <th class="text-left py-3 px-2 theme-text-secondary font-medium">
                {t('statusFilter')}
              </th>
              <th class="text-left py-3 px-2 theme-text-secondary font-medium">
                {t('actionsColumn')}
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={tasks()}>
              {(task) => (
                <tr class="border-b theme-border transition-colors">
                  <td class="py-3 px-2 theme-text-secondary">{task.id}</td>
                  <td class="py-3 px-2 theme-text-primary font-medium">
                    {task.name}
                  </td>
                  <td class="py-3 px-2 theme-text-secondary">{task.assignedTo}</td>
                  <td class="py-3 px-2">
                    <StatusBadge status={task.status} />
                  </td>
                  <td class="py-3 px-2">
                    <div class="flex gap-2">
                      <button class="px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200 transition-colors">
                        {t('view')}
                      </button>
                      <button class="px-3 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors">
                        ✓
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Photo Validation Component
const PhotoValidation = () => {
  const { t } = useLanguage();
  const [photoStatus] = createSignal({
    lowQualityAlert: "#04",
    thumbnails: 3,
  });

  return (
    <Card>
      <div class="text-lg font-bold theme-text-primary mb-1 font-poppins flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
        </svg>
        {t('photoValidationTitle')}
      </div>
      <div class="text-sm theme-text-secondary mb-5 font-medium">
        {t('qualityControlAndValidation')}
      </div>

      {/* Thumbnails */}
      <div class="mb-4">
        <div class="flex gap-3 mb-3">
          <div class="w-16 h-16 theme-card rounded-lg flex items-center justify-center theme-text-secondary border theme-border transition-colors duration-200">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="w-16 h-16 theme-card rounded-lg flex items-center justify-center theme-text-secondary border theme-border transition-colors duration-200">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="w-16 h-16 theme-card rounded-lg flex items-center justify-center theme-text-secondary border theme-border transition-colors duration-200">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
        <div class="text-xs theme-text-tertiary font-medium theme-card px-2 py-1 rounded">
          [{photoStatus().thumbnails} {t('thumbnails')}]
        </div>
      </div>

      {/* Quality Alert */}
      <div class="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center gap-2 text-red-700 dark:text-red-400">
          <span class="text-red-500 dark:text-red-400 text-lg">⚠️</span>
          <span class="font-semibold">
            {t('lowQualityAlert')}{photoStatus().lowQualityAlert}
          </span>
        </div>
        <div class="text-sm text-red-600 dark:text-red-400 mt-1 font-medium">
          {t('photoRequiresQualityReview')}
        </div>
      </div>

      {/* Actions */}
      <div class="flex gap-3">
        <button class="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          {t('uploadPhoto')}
        </button>
        <button class="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          {t('validate')}
        </button>
      </div>
    </Card>
  );
};

// Network Performance Component
const NetworkPerformance = () => {
  const { t } = useLanguage();
  const [networkStats] = createSignal({
    uptime: 99.2,
    latency: 125,
    bandwidth: 85,
  });

  return (
    <Card>
      <div class="text-lg font-bold theme-text-primary mb-1 font-poppins flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd"></path>
        </svg>
        {t("networkPerformance")}
      </div>
      <div class="text-sm theme-text-secondary mb-5 font-medium">
        {t("realtimeNetworkMonitoring")}
      </div>

      <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="text-center p-4 theme-card rounded-lg border theme-border">
          <div class="text-3xl font-bold text-green-600 font-poppins">{networkStats().uptime}%</div>
          <div class="text-sm theme-text-secondary font-medium">Uptime</div>
        </div>
        <div class="text-center p-4 theme-card rounded-lg border theme-border">
          <div class="text-3xl font-bold text-blue-600 font-poppins">{networkStats().latency}ms</div>
          <div class="text-sm theme-text-secondary font-medium">Latency</div>
        </div>
      </div>

        <div class="mt-4 p-4 theme-card rounded-lg border theme-border">
          <div class="flex justify-between items-center mb-2">
            <span class="theme-text-primary font-medium">Bandwidth Usage</span>
            <span class="text-xl font-bold theme-text-primary font-poppins">
              {networkStats().bandwidth}%
            </span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full">
            <div
              class="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={`width: ${networkStats().bandwidth}%;`}>
            </div>
          </div>
          <div class="text-xs theme-text-tertiary mt-1 font-medium">of 1Gbps</div>
        </div>
      </div>
    </Card>
  );
};

// Integration Status Component
const IntegrationStatus = () => {
  const { t } = useLanguage();
  const [integrations] = createSignal([
    { name: "Kantor ABJ Integration", status: "Connected" },
    { name: "Tech Solution Updates", status: "In Progress" },
    { name: "Network Scheduling", status: "Connected" },
  ]);

  return (
    <Card>
      <div class="text-lg font-bold theme-text-primary mb-1 font-poppins flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
        </svg>
        {t('integrationStatus')}
      </div>
      <div class="text-sm theme-text-secondary mb-5 font-medium">
        {t('systemIntegrationsConnections')}
      </div>

      <ul class="space-y-3">
        <For each={integrations()}>
          {(integration) => (
            <li class="flex justify-between items-center py-3 px-4 theme-card rounded-lg border theme-border transition-all duration-200">
              <span class="theme-text-primary font-medium">{integration.name}</span>
              <StatusBadge status={integration.status} />
            </li>
          )}
        </For>
      </ul>
    </Card>
  );
};

// Recent Activities Component
const RecentActivities = () => {
  const { t } = useLanguage();
  const [activities] = createSignal([
    { activity: "Task #04 - Photo validation required", time: "5 min ago" },
    { activity: "John Doe completed CCTV installation", time: "20 min ago" },
    { activity: "New task assigned to Sarah L.", time: "1 hour ago" },
    { activity: "Network performance alert resolved", time: "2 hours ago" },
  ]);

  return (
    <Card>
      <div class="text-lg font-bold text-gray-900 dark:text-white mb-1 font-poppins flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
        {t('recentActivities')}
      </div>
      <div class="text-sm text-gray-600 mb-5 font-medium">
        {t('latestOspEventsUpdates')}
      </div>

      <ul class="space-y-3">
        <For each={activities()}>
          {(activity) => (
            <li class="flex justify-between items-start py-3 px-4 theme-card rounded-lg border theme-border transition-all duration-200">
              <span class="text-gray-700 dark:text-slate-300 font-medium leading-relaxed">
                {activity.activity}
              </span>
              <span class="text-xs text-blue-600 dark:text-blue-400 font-semibold whitespace-nowrap ml-3 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                {activity.time}
              </span>
            </li>
          )}
        </For>
      </ul>
    </Card>
  );
};

// Overall Progress Component (retain)
const OverallProgress = () => {
  const { t } = useLanguage();
  const [stats] = createSignal({ total: 48, completed: 33 });
  const percent = Math.round((stats().completed / stats().total) * 100);

  return (
    <Card>
      <div class="text-lg font-semibold theme-text-primary mb-1 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {t('overallProgress')}
      </div>
      <div class="text-sm theme-text-secondary mb-4">{t('statusProgressAllTasks')}</div>

      <div class="w-full theme-bg-subtle rounded-full h-4 overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
          style={`width: ${percent}%;`}>
        </div>
      </div>

      <div class="flex justify-between items-center mt-3 text-sm text-neutral-600 dark:text-slate-300">
        <span>{stats().completed} of {stats().total} {t('tasksCompleted')}</span>
        <span class="font-semibold text-neutral-800 dark:text-white">{percent}%</span>
      </div>
    </Card>
  );
};

// Technician List Component (retain)
const TechnicianList = () => {
  const { t } = useLanguage();
  const [techs] = createSignal([
    { id: "t1", name: "John Doe", role: "Field Technician", avatar: "JD", status: "Active", tasks: 5 },
    { id: "t2", name: "Sarah L.", role: "Senior Tech", avatar: "SL", status: "Active", tasks: 3 },
    { id: "t3", name: "David P.", role: "Support", avatar: "DP", status: "Idle", tasks: 1 },
  ]);

  return (
    <Card>
      <div class="text-lg font-semibold theme-text-primary mb-1 flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-blue-600">
          <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {t("technicianActivity")}
      </div>
      <div class="text-sm theme-text-secondary mb-4">{t("activeTechnicians")}</div>

      <ul class="space-y-3">
        <For each={techs()}>
          {(tech) => (
            <li class="flex items-center justify-between py-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full theme-bg-subtle flex items-center justify-center font-semibold theme-text-primary">
                  {tech.avatar}
                </div>
                <div>
                  <div class="text-neutral-800 dark:text-white font-medium">{tech.name}</div>
                  <div class="text-xs text-neutral-500 dark:text-slate-400">{tech.role}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-sm text-neutral-600 dark:text-slate-300">{tech.tasks} tasks</div>
                <StatusBadge status={tech.status === "Active" ? "Active" : "Pending"} />
              </div>
            </li>
          )}
        </For>
      </ul>
    </Card>
  );
};

// Main OSP Content Component
const OSPContent = () => {
  return (
    <div class="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-6">
      <TaskOverview />
      <OverallProgress />
      <NetworkPerformance />
      <PhotoValidation />
      <TechnicianList />
      <IntegrationStatus />
      <RecentActivities />
      <div class="xl:col-span-3 lg:col-span-2">
        <TaskList />
      </div>
    </div>
  );
};

// Main OSP Component
const OSP = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      {/* Header */}
      <div class="relative bg-white dark:bg-slate-800 rounded-lg p-8 mb-6 overflow-hidden shadow-sm border border-gray-200 dark:border-slate-600">
        <div class="relative z-10">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("ospManagement")}</h1>
          <p class="text-gray-600 dark:text-slate-300 text-lg">
            {t("ospDescription")}
          </p>
        </div>
        {/* Background Icon */}
        <div class="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20">
          <svg
            class="w-24 h-24 text-gray-400 dark:text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            <circle cx="9" cy="9" r="2" />
            <circle cx="15" cy="15" r="2" />
            <path d="M9 9h6m-3-3v6" />
          </svg>
        </div>
      </div>

      <OSPContent />
    </Layout>
  );
};

export default OSP;

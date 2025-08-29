import { createSignal, onMount, For, Show } from "solid-js";
import Layout from "../layouts/Layout";

// Status Badge Component
const StatusBadge = (props) => {
  const getStatusClass = () => {
    switch (props.status) {
      case "online":
        return "bg-accent-emerald/20 text-accent-emerald";
      case "offline":
        return "bg-accent-rose/20 text-accent-rose";
      case "maintenance":
        return "bg-accent-amber/20 text-accent-amber";
      default:
        return "bg-neutral-100 text-neutral-600";
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
  return (
    <div class="my-5">
      <div class="text-sm text-neutral-600 mb-2">{props.label}</div>
      <div class="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
          style={`width: ${props.value}%;`}
        ></div>
      </div>
      <div class="text-sm text-neutral-600 mt-1">{props.value}%</div>
    </div>
  );
};

// Card Component
const Card = (props) => {
  return (
    <div
      class="bg-neutral-100 rounded-2xl p-6 shadow-xl border border-neutral-100 
      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      {props.children}
    </div>
  );
};

// Camera Monitoring Component
const CameraMonitoring = () => {
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
          <div class="text-lg font-semibold text-neutral-900 mb-1">
            Camera Monitoring
          </div>
          <div class="text-sm text-neutral-600">
            {detectedResidents()} Residents Detected
          </div>
        </div>
        <StatusBadge
          status={isRecording() ? "online" : "offline"}
          activeText="Recording"
        />
      </div>
      <div class="w-full h-48 bg-neutral-900 rounded-lg flex items-center justify-center text-white text-sm mb-4 relative">
        <Show when={isRecording()}>
          <div class="absolute top-2 right-2 bg-accent-rose text-white px-2 py-1 rounded text-xs animate-pulse">
            ● REC
          </div>
        </Show>
        📹 Live Feed {isRecording() ? "Active" : "Inactive"}
      </div>
      <button
        class="bg-gradient-to-r from-sky-600 to-blue-700 text-white px-5 py-2 rounded-lg 
          font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        onClick={openAllCameras}
      >
        Open All Cameras
      </button>
    </Card>
  );
};

// Smart Clustering Component
const SmartClustering = () => {
  const [smartClusteringStatus] = createSignal([
    { name: "Face Recognition", status: "online" },
    { name: "Auto Clustering", status: "online" },
    { name: "CCTV Integration", status: "online" },
    { name: "Super App Integration", status: "maintenance" },
  ]);

  return (
    <Card>
      <div class="text-lg font-semibold text-gray-800 mb-1">
        Smart Clustering Status
      </div>
      <div class="text-sm text-gray-600 mb-5">
        Otomatisasi berdasarkan pengenalan wajah
      </div>
      <ul class="space-y-2">
        <For each={smartClusteringStatus()}>
          {(item) => (
            <li class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-700">{item.name}</span>
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
      <div class="text-lg font-semibold text-gray-800 mb-1">
        System Performance
      </div>
      <div class="text-sm text-gray-600 mb-5">Real-time system monitoring</div>
      <ProgressBar label="CPU Usage" value={systemMetrics().cpu} />
      <ProgressBar label="Memory Usage" value={systemMetrics().memory} />
      <ProgressBar label="Storage" value={systemMetrics().storage} />
    </Card>
  );
};

// OSP Management Component
const OSPManagement = () => {
  const [activeTasks] = createSignal(24);
  const [ospTasks] = createSignal([
    { name: "Kantor ABJ Integration", status: "online" },
    { name: "Tech Solution Updates", status: "maintenance" },
    { name: "Network Scheduling", status: "online" },
  ]);

  return (
    <Card>
      <div class="text-lg font-semibold text-gray-800 mb-1">OSP Management</div>
      <div class="text-sm text-gray-600 mb-5">Operational Support Platform</div>
      <div class="text-3xl font-bold text-gray-800 my-3">{activeTasks()}</div>
      <div class="text-sm text-gray-600 mb-5">Active Tasks</div>
      <ul class="space-y-2">
        <For each={ospTasks()}>
          {(item) => (
            <li class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-700">{item.name}</span>
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
      <div class="text-lg font-semibold text-gray-800 mb-1">Network Status</div>
      <div class="text-sm text-gray-600 mb-5">
        Connectivity and bandwidth monitoring
      </div>
      <div class="grid grid-cols-2 gap-5 my-5">
        <div>
          <div class="text-2xl font-bold text-gray-800">
            {networkStatus().uptime}%
          </div>
          <div class="text-sm text-gray-600">Uptime</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-800">
            {networkStatus().latency}ms
          </div>
          <div class="text-sm text-gray-600">Latency</div>
        </div>
      </div>
      <div class="text-sm text-gray-600 mb-2">Bandwidth Usage</div>
      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          class="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
          style={`width: ${networkStatus().bandwidth}%;`}
        ></div>
      </div>
      <div class="text-sm text-gray-600">
        {networkStatus().bandwidth}% of 1Gbps
      </div>
    </Card>
  );
};

// Recent Activities Component
const RecentActivities = () => {
  const [recentActivities] = createSignal([
    { activity: "Face detected - Security cam 1", time: "2 min ago" },
    { activity: "OSP task completed", time: "15 min ago" },
    { activity: "System backup completed", time: "1 hour ago" },
    { activity: "New device connected", time: "2 hours ago" },
  ]);

  return (
    <Card>
      <div class="text-lg font-semibold text-gray-800 mb-1">
        Recent Activities
      </div>
      <div class="text-sm text-gray-600 mb-5">
        Latest system events and updates
      </div>
      <ul class="space-y-2">
        <For each={recentActivities()}>
          {(activity) => (
            <li class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-gray-700">{activity.activity}</span>
              <span class="text-xs text-gray-500">{activity.time}</span>
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
  return (
    <Layout>
      <div class="space-y-8">
        {/* Header */}
        <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">Dashboard Overview</h1>
              <p class="text-blue-100 text-lg">
                Monitor sistem keamanan, performa jaringan, dan aktivitas real-time
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

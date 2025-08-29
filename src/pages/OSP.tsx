import { createSignal, onMount, For, Show } from "solid-js";
import Layout from "../layouts/Layout";

// Status Badge Component
const StatusBadge = (props) => {
  const getStatusClass = () => {
    switch (props.status) {
      case "Active":
        return "bg-accent-emerald/20 text-accent-emerald";
      case "Pending":
        return "bg-accent-amber/20 text-accent-amber";
      case "Done":
        return "bg-accent-emerald/20 text-accent-emerald";
      case "Review":
        return "bg-accent-rose/20 text-accent-rose";
      case "Connected":
        return "bg-accent-emerald/20 text-accent-emerald";
      case "In Progress":
        return "bg-accent-amber/20 text-accent-amber";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <span
      class={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}
    >
      {props.status}
    </span>
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

// Task Overview Component
const TaskOverview = () => {
  const [taskStats] = createSignal({
    active: 12,
    completed: 45,
    additional: 5,
  });

  return (
    <Card>
      <div class="text-lg font-semibold text-neutral-900 mb-1">
        📋 Task Overview
      </div>
      <div class="text-sm text-neutral-600 mb-5">
        Current task statistics and progress
      </div>

      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-neutral-700">Active Tasks:</span>
          <span class="text-2xl font-bold text-blue-600">
            {taskStats().active}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-neutral-700">Completed Tasks:</span>
          <span class="text-2xl font-bold text-green-600">
            {taskStats().completed}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-neutral-700">Additional Tasks:</span>
          <span class="text-2xl font-bold text-orange-600">
            {taskStats().additional}
          </span>
        </div>
      </div>

      <div class="mt-6">
        <button
          class="w-full bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg 
          font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          + Add New Task
        </button>
      </div>
    </Card>
  );
};

// Task List Component
const TaskList = () => {
  const [tasks] = createSignal([
    {
      id: "01",
      name: "Install CCTV",
      assignedTo: "John Doe",
      status: "Active",
    },
    {
      id: "02",
      name: "Check Fiber Optic",
      assignedTo: "Sarah L.",
      status: "Pending",
    },
    { id: "03", name: "Repair Router", assignedTo: "David P.", status: "Done" },
    {
      id: "04",
      name: "Extra Work (Foto)",
      assignedTo: "Unknown",
      status: "Review",
    },
  ]);

  const [filters] = createSignal({
    status: "All",
    date: "All",
    technician: "All",
  });

  return (
    <Card>
      <div class="text-lg font-semibold text-neutral-900 mb-1">
        📋 Task List
      </div>
      <div class="text-sm text-neutral-600 mb-5">
        Manage and track all tasks
      </div>

      {/* Search and Filters */}
      <div class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div class="flex flex-wrap gap-3 items-center">
          <div class="flex items-center gap-2">
            <span class="text-blue-600 font-medium">🔍 Search</span>
            <span class="text-blue-800 font-semibold">Task</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-blue-600">Filter:</span>
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              [Status ▼]
            </span>
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              [Date ▼]
            </span>
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              [Technician ▼]
            </span>
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-200">
              <th class="text-left py-3 px-2 text-neutral-700 font-medium">
                #
              </th>
              <th class="text-left py-3 px-2 text-neutral-700 font-medium">
                Task Name
              </th>
              <th class="text-left py-3 px-2 text-neutral-700 font-medium">
                Assigned To
              </th>
              <th class="text-left py-3 px-2 text-neutral-700 font-medium">
                Status
              </th>
              <th class="text-left py-3 px-2 text-neutral-700 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={tasks()}>
              {(task) => (
                <tr class="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td class="py-3 px-2 text-neutral-600">{task.id}</td>
                  <td class="py-3 px-2 text-neutral-800 font-medium">
                    {task.name}
                  </td>
                  <td class="py-3 px-2 text-neutral-600">{task.assignedTo}</td>
                  <td class="py-3 px-2">
                    <StatusBadge status={task.status} />
                  </td>
                  <td class="py-3 px-2">
                    <div class="flex gap-2">
                      <button class="px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200 transition-colors">
                        View
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
  const [photoStatus] = createSignal({
    lowQualityAlert: "#04",
    thumbnails: 3,
  });

  return (
    <Card>
      <div class="text-lg font-semibold text-neutral-900 mb-1">
        📷 Photo Validation
      </div>
      <div class="text-sm text-neutral-600 mb-5">
        Quality control and validation
      </div>

      {/* Thumbnails */}
      <div class="mb-4">
        <div class="flex gap-2 mb-3">
          <div class="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-500">
            📷
          </div>
          <div class="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-500">
            📷
          </div>
          <div class="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-500">
            📷
          </div>
        </div>
        <div class="text-xs text-neutral-600">
          [{photoStatus().thumbnails} Thumbnail(s)]
        </div>
      </div>

      {/* Quality Alert */}
      <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2 text-red-700">
          <span class="text-red-500">⚠️</span>
          <span class="font-medium">
            Low Quality Alert: Task #{photoStatus().lowQualityAlert}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div class="flex gap-2">
        <button class="flex-1 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
          📤 Upload Photo
        </button>
        <button class="flex-1 bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
          ✓ Validate
        </button>
      </div>
    </Card>
  );
};

// Network Performance Component
const NetworkPerformance = () => {
  const [networkStats] = createSignal({
    uptime: 99.2,
    latency: 125,
    bandwidth: 85,
  });

  return (
    <Card>
      <div class="text-lg font-semibold text-neutral-900 mb-1">
        🌐 Network Performance
      </div>
      <div class="text-sm text-neutral-600 mb-5">
        Real-time network monitoring
      </div>

      <div class="space-y-4">
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-neutral-700 text-sm">Uptime</span>
            <span class="text-2xl font-bold text-green-600">
              {networkStats().uptime}%
            </span>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-neutral-700 text-sm">Latency</span>
            <span class="text-xl font-bold text-blue-600">
              {networkStats().latency}ms
            </span>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-neutral-700 text-sm">Bandwidth Usage</span>
            <span class="text-lg font-bold text-purple-600">
              {networkStats().bandwidth}%
            </span>
          </div>
          <div class="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
              style={`width: ${networkStats().bandwidth}%;`}
            ></div>
          </div>
          <div class="text-xs text-neutral-600 mt-1">of 1Gbps</div>
        </div>
      </div>
    </Card>
  );
};

// Integration Status Component
const IntegrationStatus = () => {
  const [integrations] = createSignal([
    { name: "Kantor ABJ Integration", status: "Connected" },
    { name: "Tech Solution Updates", status: "In Progress" },
    { name: "Network Scheduling", status: "Connected" },
  ]);

  return (
    <Card>
      <div class="text-lg font-semibold text-neutral-900 mb-1">
        🔗 Integration Status
      </div>
      <div class="text-sm text-neutral-600 mb-5">
        System integrations and connections
      </div>

      <ul class="space-y-3">
        <For each={integrations()}>
          {(integration) => (
            <li class="flex justify-between items-center py-2 border-b border-neutral-100">
              <span class="text-neutral-700 text-sm">{integration.name}</span>
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
  const [activities] = createSignal([
    { activity: "Task #04 - Photo validation required", time: "5 min ago" },
    { activity: "John Doe completed CCTV installation", time: "20 min ago" },
    { activity: "New task assigned to Sarah L.", time: "1 hour ago" },
    { activity: "Network performance alert resolved", time: "2 hours ago" },
  ]);

  return (
    <Card>
      <div class="text-lg font-semibold text-neutral-900 mb-1">
        📝 Recent Activities
      </div>
      <div class="text-sm text-neutral-600 mb-5">
        Latest OSP events and updates
      </div>

      <ul class="space-y-2">
        <For each={activities()}>
          {(activity) => (
            <li class="flex justify-between items-start py-2 border-b border-neutral-100">
              <span class="text-neutral-700 text-sm leading-relaxed">
                {activity.activity}
              </span>
              <span class="text-xs text-neutral-500 whitespace-nowrap ml-3">
                {activity.time}
              </span>
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
      <NetworkPerformance />
      <PhotoValidation />
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
  return (
    <Layout>
      <OSPContent />
    </Layout>
  );
};

export default OSP;

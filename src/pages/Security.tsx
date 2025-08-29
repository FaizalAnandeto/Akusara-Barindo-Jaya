import { Component, createSignal, For, Show, onMount } from "solid-js";
import Layout from "../layouts/Layout";
import {
  SecurityAnalyticsChart,
  ThreatLevelChart,
} from "../components/SecurityCharts";

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

// Status Badge Component
const StatusBadge: Component<{ status: string }> = (props) => {
  const getStatusColor = () => {
    switch (props.status.toLowerCase()) {
      case "online":
      case "active":
      case "authorized":
      case "recording":
      case "4k":
        return "bg-accent-emerald/20 text-accent-emerald";
      case "medium":
      case "1080p":
        return "bg-accent-amber/20 text-accent-amber";
      case "offline":
      case "denied":
      case "high":
      case "suspicious":
      case "720p":
        return "bg-accent-rose/20 text-accent-rose";
      case "low":
      case "connected":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <span
      class={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {props.status}
    </span>
  );
};

// Advanced Camera Monitoring System
const AdvancedCameraSystem = () => {
  const [cameras] = createSignal([
    {
      id: 1,
      name: "Main Entrance - CAM001",
      status: "recording",
      location: "Building A - Front Gate",
      resolution: "4K",
      fps: 30,
      zoom: "5x Optical",
      nightVision: true,
      motionDetection: true,
      audioRecording: true,
      storage: "Cloud + Local NVR",
      lastMaintenance: "2024-08-15",
    },
    {
      id: 2,
      name: "Server Room - CAM002",
      status: "recording",
      location: "Building A - Data Center",
      resolution: "4K",
      fps: 60,
      zoom: "10x Digital",
      nightVision: true,
      motionDetection: true,
      audioRecording: false,
      storage: "Secure Local Storage",
      lastMaintenance: "2024-08-20",
    },
    {
      id: 3,
      name: "Parking Area - CAM003",
      status: "recording",
      location: "Outdoor - West Side",
      resolution: "4K",
      fps: 30,
      zoom: "12x Optical",
      nightVision: true,
      motionDetection: true,
      audioRecording: true,
      storage: "Cloud Storage",
      lastMaintenance: "2024-08-10",
    },
    {
      id: 4,
      name: "Emergency Exit - CAM004",
      status: "offline",
      location: "Building B - East Exit",
      resolution: "1080p",
      fps: 30,
      zoom: "3x Digital",
      nightVision: false,
      motionDetection: true,
      audioRecording: false,
      storage: "Local NVR",
      lastMaintenance: "2024-07-28",
    },
  ]);

  const [selectedCamera, setSelectedCamera] = createSignal(1);
  const [detectedPersons] = createSignal(7);
  const [totalRecordingHours] = createSignal(2847);

  const getCurrentCamera = () =>
    cameras().find((c) => c.id === selectedCamera());

  return (
    <div class="lg:col-span-2">
      <Card>
        <div class="flex justify-between items-center mb-6">
          <div>
            <div class="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
              <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="text-white"
                >
                  <path d="M23 7l-7 5 7 5V7z" fill="currentColor" />
                  <rect
                    x="1"
                    y="5"
                    width="15"
                    height="14"
                    rx="2"
                    fill="currentColor"
                  />
                  <path d="M1 7h15" stroke="white" stroke-width="1" />
                </svg>
              </div>
              Advanced Camera Monitoring System
            </div>
            <div class="text-sm text-neutral-600">
              {detectedPersons()} Active Detections •{" "}
              {cameras().filter((c) => c.status === "recording").length}/
              {cameras().length} Cameras Online • {totalRecordingHours()}h Total
              Recording
            </div>
          </div>
          <StatusBadge status="recording" />
        </div>

        {/* Main Camera Display */}
        <div class="relative w-full h-64 bg-neutral-900 rounded-xl overflow-hidden mb-6">
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>

          {/* Recording Indicator */}
          <Show when={getCurrentCamera()?.status === "recording"}>
            <div class="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl text-sm shadow-xl z-20 flex items-center gap-3 border border-red-500/30">
              {/* Recording Icon */}
              <div class="relative flex items-center gap-2">
                <div class="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
              </div>
              {/* Text */}
              <span class="font-semibold tracking-wide">LIVE REC</span>
              {/* Signal bars animation */}
              <div class="flex items-end gap-0.5">
                <div
                  class="w-0.5 h-2 bg-white rounded-full animate-pulse"
                  style="animation-delay: 0ms"
                ></div>
                <div
                  class="w-0.5 h-3 bg-white rounded-full animate-pulse"
                  style="animation-delay: 200ms"
                ></div>
                <div
                  class="w-0.5 h-4 bg-white rounded-full animate-pulse"
                  style="animation-delay: 400ms"
                ></div>
              </div>
            </div>
          </Show>

          {/* Camera Info Overlay */}
          <div class="absolute bottom-4 left-4 text-white z-20">
            <div class="text-lg font-semibold">{getCurrentCamera()?.name}</div>
            <div class="text-sm opacity-90">{getCurrentCamera()?.location}</div>
            <div class="flex gap-4 mt-2">
              <span class="bg-black/50 px-2 py-1 rounded text-xs">
                {getCurrentCamera()?.resolution} • {getCurrentCamera()?.fps}fps
              </span>
              <span class="bg-black/50 px-2 py-1 rounded text-xs">
                {getCurrentCamera()?.zoom}
              </span>
              <Show when={getCurrentCamera()?.nightVision}>
                <span class="bg-black/50 px-2 py-1 rounded text-xs flex items-center gap-1">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-yellow-300"
                  >
                    <path
                      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                      fill="currentColor"
                    />
                  </svg>
                  Night Vision
                </span>
              </Show>
            </div>
          </div>

          {/* Mock Video Display */}
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-white">
              <div class="mb-6 flex justify-center">
                <div class="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <svg
                    width="72"
                    height="72"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-white"
                  >
                    <path
                      d="M23 7l-7 5 7 5V7z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    <rect
                      x="1"
                      y="5"
                      width="15"
                      height="14"
                      rx="2"
                      fill="currentColor"
                      opacity="0.8"
                    />
                    <circle cx="8.5" cy="12" r="2" fill="white" opacity="0.6" />
                    <path
                      d="M1 7h15"
                      stroke="white"
                      stroke-width="0.5"
                      opacity="0.4"
                    />
                  </svg>
                </div>
              </div>
              <div class="text-xl font-medium mb-2">
                {getCurrentCamera()?.name}
              </div>
              <div class="text-sm opacity-75 bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                {getCurrentCamera()?.resolution} @ {getCurrentCamera()?.fps}fps
              </div>
            </div>
          </div>
        </div>

        {/* Camera Grid Selection */}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <For each={cameras()}>
            {(camera) => (
              <div
                class={`relative border-2 rounded-lg p-3 cursor-pointer transition-all hover:scale-105 ${
                  selectedCamera() === camera.id
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
                onClick={() => setSelectedCamera(camera.id)}
              >
                <div class="aspect-video bg-neutral-800 rounded-lg flex items-center justify-center mb-2 overflow-hidden relative">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="text-neutral-400"
                  >
                    <path d="M23 7l-7 5 7 5V7z" fill="currentColor" />
                    <rect
                      x="1"
                      y="5"
                      width="15"
                      height="14"
                      rx="2"
                      fill="currentColor"
                    />
                  </svg>
                  <Show when={camera.status === "recording"}>
                    <div class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                  </Show>
                </div>
                <div class="space-y-1">
                  <div class="text-xs font-semibold text-neutral-800 truncate">
                    {camera.name}
                  </div>
                  <div class="text-xs text-neutral-600 truncate">
                    {camera.location}
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-neutral-500">
                      {camera.resolution} • {camera.fps}fps
                    </span>
                    <StatusBadge status={camera.status} />
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Camera Details Panel */}
        <Show when={getCurrentCamera()}>
          <div class="bg-white rounded-xl p-4 border border-neutral-200">
            <div class="text-sm font-semibold text-neutral-800 mb-3">
              Camera Technical Specifications
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div class="text-xs text-neutral-500">Resolution & FPS</div>
                <div class="text-sm font-medium text-neutral-800">
                  {getCurrentCamera()?.resolution} @ {getCurrentCamera()?.fps}
                  fps
                </div>
              </div>
              <div>
                <div class="text-xs text-neutral-500">Zoom Capability</div>
                <div class="text-sm font-medium text-neutral-800">
                  {getCurrentCamera()?.zoom}
                </div>
              </div>
              <div>
                <div class="text-xs text-neutral-500">Storage Type</div>
                <div class="text-sm font-medium text-neutral-800">
                  {getCurrentCamera()?.storage}
                </div>
              </div>
              <div>
                <div class="text-xs text-neutral-500">Last Maintenance</div>
                <div class="text-sm font-medium text-neutral-800">
                  {getCurrentCamera()?.lastMaintenance}
                </div>
              </div>
            </div>

            <div class="flex gap-4 mt-3">
              <div class="flex items-center gap-2">
                <span
                  class={`w-2 h-2 rounded-full ${
                    getCurrentCamera()?.nightVision
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></span>
                <span class="text-xs text-neutral-600">Night Vision</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class={`w-2 h-2 rounded-full ${
                    getCurrentCamera()?.motionDetection
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></span>
                <span class="text-xs text-neutral-600">Motion Detection</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class={`w-2 h-2 rounded-full ${
                    getCurrentCamera()?.audioRecording
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></span>
                <span class="text-xs text-neutral-600">Audio Recording</span>
              </div>
            </div>
          </div>
        </Show>

        <div class="flex gap-3 mt-6">
          <button class="bg-gradient-to-r from-sky-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex-1 flex items-center justify-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <path d="M23 7l-7 5 7 5V7z" fill="currentColor" />
              <rect
                x="1"
                y="5"
                width="15"
                height="14"
                rx="2"
                fill="currentColor"
              />
            </svg>
            Open All Camera Feeds
          </button>
          <button class="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <path
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                fill="currentColor"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                fill="currentColor"
              />
            </svg>
            Settings
          </button>
        </div>
      </Card>
    </div>
  );
};

// Advanced Suspicious Activity Detection System
const SuspiciousActivityDetection = () => {
  const [suspiciousActivities] = createSignal([
    {
      id: 1,
      type: "Unauthorized Access Attempt",
      location: "Server Room - CAM002",
      timestamp: "2024-08-29 14:32:15",
      severity: "high",
      confidence: 94.5,
      aiAnalysis:
        "Person attempting to access restricted area without proper credentials",
      imageUrl: "/suspicious-1.jpg",
      actions: ["Alert Security", "Lock Down Area", "Record Evidence"],
      status: "investigating",
    },
    {
      id: 2,
      type: "Loitering Detection",
      location: "Parking Area - CAM003",
      timestamp: "2024-08-29 14:15:42",
      severity: "medium",
      confidence: 87.2,
      aiAnalysis:
        "Individual remaining in same location for extended period (>15 minutes)",
      imageUrl: "/suspicious-2.jpg",
      actions: ["Monitor Closely", "Send Warning"],
      status: "monitoring",
    },
    {
      id: 3,
      type: "Unusual Movement Pattern",
      location: "Main Entrance - CAM001",
      timestamp: "2024-08-29 13:58:09",
      severity: "medium",
      confidence: 82.1,
      aiAnalysis:
        "Person exhibiting irregular movement patterns, possible surveillance behavior",
      imageUrl: "/suspicious-3.jpg",
      actions: ["Review Footage", "Alert Personnel"],
      status: "resolved",
    },
    {
      id: 4,
      type: "Facial Recognition Mismatch",
      location: "Emergency Exit - CAM004",
      timestamp: "2024-08-29 13:45:33",
      severity: "high",
      confidence: 91.8,
      aiAnalysis:
        "Person's face does not match employee database or visitor registry",
      imageUrl: "/suspicious-4.jpg",
      actions: ["Immediate Investigation", "Security Response"],
      status: "escalated",
    },
  ]);

  const [alertStats] = createSignal({
    totalToday: 24,
    highPriority: 6,
    resolved: 18,
    investigating: 4,
    falsePositives: 2,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500";
      case "investigating":
        return "bg-amber-500";
      case "escalated":
        return "bg-red-500";
      case "monitoring":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <div class="mb-6">
        <div class="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
          <div class="bg-gradient-to-r from-red-600 to-rose-700 p-2 rounded-xl shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                fill="currentColor"
              />
              <line
                x1="12"
                y1="9"
                x2="12"
                y2="13"
                stroke="white"
                stroke-width="2"
              />
              <circle cx="12" cy="17" r="1" fill="white" />
            </svg>
          </div>
          Advanced Suspicious Activity Detection
        </div>
        <div class="text-sm text-neutral-600">
          AI-powered real-time threat analysis and behavior monitoring
        </div>
      </div>

      {/* Alert Statistics */}
      <div class="grid grid-cols-5 gap-3 mb-6">
        <div class="text-center p-3 bg-blue-50 rounded-lg">
          <div class="text-lg font-bold text-blue-700">
            {alertStats().totalToday}
          </div>
          <div class="text-xs text-blue-600">Total Today</div>
        </div>
        <div class="text-center p-3 bg-red-50 rounded-lg">
          <div class="text-lg font-bold text-red-700">
            {alertStats().highPriority}
          </div>
          <div class="text-xs text-red-600">High Priority</div>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg">
          <div class="text-lg font-bold text-green-700">
            {alertStats().resolved}
          </div>
          <div class="text-xs text-green-600">Resolved</div>
        </div>
        <div class="text-center p-3 bg-amber-50 rounded-lg">
          <div class="text-lg font-bold text-amber-700">
            {alertStats().investigating}
          </div>
          <div class="text-xs text-amber-600">Investigating</div>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-lg font-bold text-gray-700">
            {alertStats().falsePositives}
          </div>
          <div class="text-xs text-gray-600">False Positive</div>
        </div>
      </div>

      {/* Suspicious Activities List */}
      <div class="space-y-3 max-h-[34.5rem] overflow-y-auto">
        <For each={suspiciousActivities()}>
          {(activity) => (
            <div
              class={`border-2 rounded-xl p-4 ${getSeverityColor(
                activity.severity
              )}`}
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center">
                      {activity.severity === "high" ? (
                        <div class="bg-red-100 p-1 rounded-full">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="text-red-600"
                          >
                            <path
                              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                              fill="currentColor"
                            />
                            <line
                              x1="12"
                              y1="9"
                              x2="12"
                              y2="13"
                              stroke="white"
                              stroke-width="2"
                            />
                            <circle cx="12" cy="17" r="1" fill="white" />
                          </svg>
                        </div>
                      ) : activity.severity === "medium" ? (
                        <div class="bg-yellow-100 p-1 rounded-full">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="text-yellow-600"
                          >
                            <path
                              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                              fill="currentColor"
                            />
                            <line
                              x1="12"
                              y1="9"
                              x2="12"
                              y2="13"
                              stroke="white"
                              stroke-width="2"
                            />
                            <circle cx="12" cy="17" r="1" fill="white" />
                          </svg>
                        </div>
                      ) : (
                        <div class="bg-blue-100 p-1 rounded-full">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="text-blue-600"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              fill="currentColor"
                            />
                            <path
                              d="M12 16v-4M12 8h.01"
                              stroke="white"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div class="font-semibold text-neutral-900">
                        {activity.type}
                      </div>
                      <div class="text-sm text-neutral-600">
                        {activity.location}
                      </div>
                    </div>
                  </div>

                  <div class="text-sm text-neutral-700 mb-2">
                    <strong>AI Analysis:</strong> {activity.aiAnalysis}
                  </div>

                  <div class="flex items-center gap-4 text-xs text-neutral-600 mb-3">
                    <span class="flex items-center gap-1">
                      <svg
                        width="12"
                        height="12"
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
                      {activity.timestamp}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg
                        width="12"
                        height="12"
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
                        <path
                          d="M12 8v4l3 3"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Confidence: {activity.confidence}%
                    </span>
                    <div class="flex items-center gap-1">
                      <div
                        class={`w-2 h-2 rounded-full ${getStatusColor(
                          activity.status
                        )}`}
                      ></div>
                      <span class="capitalize">{activity.status}</span>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    <For each={activity.actions}>
                      {(action) => (
                        <button class="px-3 py-1 bg-white border border-neutral-300 rounded-lg text-xs font-medium hover:bg-neutral-50 transition-colors">
                          {action}
                        </button>
                      )}
                    </For>
                  </div>
                </div>

                <div class="ml-4">
                  <div class="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center">
                    <span class="text-neutral-400 text-xs">📸</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>

      <div class="mt-6 flex gap-3">
        <button class="bg-gradient-to-r from-red-600 to-rose-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex-1">
          🚨 Emergency Response Protocol
        </button>
        <button class="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            class="text-white"
          >
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              fill="currentColor"
            />
          </svg>
          AI Settings
        </button>
      </div>
    </Card>
  );
};

// Face Recognition & Access Control System
const FaceRecognitionSystem = () => {
  const [recognitionStats] = createSignal({
    totalFaces: 2847,
    todayRecognitions: 156,
    accuracy: 98.7,
    activeEmployees: 42,
    visitors: 8,
    unknownFaces: 3,
  });

  const [recentRecognitions] = createSignal([
    {
      id: 1,
      name: "Budi Santoso",
      role: "IT Manager",
      confidence: 98.5,
      time: "2 min ago",
      location: "Main Entrance",
      status: "authorized",
    },
    {
      id: 2,
      name: "Sari Dewi",
      role: "HR Director",
      confidence: 96.2,
      time: "5 min ago",
      location: "Reception",
      status: "authorized",
    },
    {
      id: 3,
      name: "Unknown Person",
      role: "Visitor",
      confidence: 87.1,
      time: "12 min ago",
      location: "Emergency Exit",
      status: "unauthorized",
    },
    {
      id: 4,
      name: "Ahmad Rizki",
      role: "Security",
      confidence: 99.1,
      time: "18 min ago",
      location: "Server Room",
      status: "authorized",
    },
    {
      id: 5,
      name: "Maya Indira",
      role: "Developer",
      confidence: 95.8,
      time: "25 min ago",
      location: "Office Area",
      status: "authorized",
    },
  ]);

  return (
    <Card>
      <div class="mb-6">
        <div class="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
          <div class="bg-gradient-to-r from-blue-600 to-cyan-700 p-2 rounded-xl shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="10"
                rx="2"
                fill="currentColor"
              />
              <circle cx="12" cy="2" r="2" fill="currentColor" />
              <path
                d="M12 4a3 3 0 0 0-3 3v4h6V7a3 3 0 0 0-3-3z"
                fill="currentColor"
              />
              <circle cx="9" cy="16" r="1" fill="white" />
              <circle cx="15" cy="16" r="1" fill="white" />
              <path
                d="M8 18h8"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>
          Face Recognition & Access Control
        </div>
        <div class="text-sm text-neutral-600">
          AI-powered facial recognition and access management system
        </div>
      </div>

      {/* Recognition Statistics */}
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-blue-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-blue-700">
            {recognitionStats().totalFaces}
          </div>
          <div class="text-xs text-blue-600">Total Faces Registered</div>
        </div>
        <div class="bg-emerald-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-emerald-700">
            {recognitionStats().todayRecognitions}
          </div>
          <div class="text-xs text-emerald-600">Today's Recognitions</div>
        </div>
        <div class="bg-purple-50 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-purple-700">
            {recognitionStats().accuracy}%
          </div>
          <div class="text-xs text-purple-600">Recognition Accuracy</div>
        </div>
      </div>

      {/* Current Status */}
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-green-50 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-green-700">
            {recognitionStats().activeEmployees}
          </div>
          <div class="text-xs text-green-600">Active Employees</div>
        </div>
        <div class="bg-amber-50 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-amber-700">
            {recognitionStats().visitors}
          </div>
          <div class="text-xs text-amber-600">Current Visitors</div>
        </div>
        <div class="bg-red-50 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-red-700">
            {recognitionStats().unknownFaces}
          </div>
          <div class="text-xs text-red-600">Unknown Faces</div>
        </div>
      </div>

      {/* Recent Recognition Events */}
      <div class="space-y-3 mb-6">
        <div class="text-sm font-semibold text-neutral-800">
          Recent Recognition Events
        </div>
        <div class="max-h-64 overflow-y-auto space-y-2">
          <For each={recentRecognitions()}>
            {(recognition) => (
              <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-neutral-300 rounded-full flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      class="text-neutral-600"
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
                  <div>
                    <div class="font-medium text-neutral-900">
                      {recognition.name}
                    </div>
                    <div class="text-xs text-neutral-600">
                      {recognition.role} • {recognition.location}
                    </div>
                    <div class="text-xs text-neutral-500">
                      {recognition.confidence}% confidence • {recognition.time}
                    </div>
                  </div>
                </div>
                <StatusBadge status={recognition.status} />
              </div>
            )}
          </For>
        </div>
      </div>

      <button class="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg w-full flex items-center justify-center gap-2">
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
            height="10"
            rx="2"
            fill="currentColor"
          />
          <circle cx="12" cy="2" r="2" fill="currentColor" />
          <path
            d="M12 4a3 3 0 0 0-3 3v4h6V7a3 3 0 0 0-3-3z"
            fill="currentColor"
          />
          <circle cx="9" cy="16" r="1" fill="white" />
          <circle cx="15" cy="16" r="1" fill="white" />
          <path
            d="M8 18h8"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        Manage Face Recognition Database
      </button>
    </Card>
  );
};

// System Status & Network Security
const SystemSecurityStatus = () => {
  const [systemStatus] = createSignal([
    { name: "Camera Network", status: "online", uptime: "99.8%" },
    { name: "Face Recognition AI", status: "online", uptime: "99.5%" },
    { name: "Motion Detection", status: "online", uptime: "99.9%" },
    { name: "Access Control", status: "online", uptime: "99.7%" },
    { name: "Alarm System", status: "online", uptime: "100%" },
    { name: "Emergency Protocol", status: "active", uptime: "100%" },
    { name: "Network Security", status: "online", uptime: "99.6%" },
    { name: "Data Backup", status: "online", uptime: "99.4%" },
  ]);

  const [securityMetrics] = createSignal({
    encryptionLevel: "AES-256",
    firewallStatus: "Active",
    intrusionAttempts: 0,
    dataIntegrity: "100%",
    lastSecurityScan: "2024-08-29 09:00:00",
  });

  return (
    <Card>
      <div class="mb-6">
        <div class="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
          <div class="bg-gradient-to-r from-green-600 to-emerald-700 p-2 rounded-xl shadow-lg">
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
          System Security Status
        </div>
        <div class="text-sm text-neutral-600">
          Comprehensive security system monitoring and health check
        </div>
      </div>

      {/* Security Metrics */}
      <div class="bg-green-50 rounded-xl p-4 mb-6">
        <div class="text-center mb-4">
          <div class="text-3xl font-bold text-green-700">99.7%</div>
          <div class="text-sm text-green-600">Overall System Uptime</div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="text-neutral-600">Encryption</div>
            <div class="font-semibold text-neutral-800">
              {securityMetrics().encryptionLevel}
            </div>
          </div>
          <div>
            <div class="text-neutral-600">Firewall</div>
            <div class="font-semibold text-neutral-800">
              {securityMetrics().firewallStatus}
            </div>
          </div>
          <div>
            <div class="text-neutral-600">Intrusion Attempts</div>
            <div class="font-semibold text-neutral-800">
              {securityMetrics().intrusionAttempts} Today
            </div>
          </div>
          <div>
            <div class="text-neutral-600">Data Integrity</div>
            <div class="font-semibold text-neutral-800">
              {securityMetrics().dataIntegrity}
            </div>
          </div>
        </div>
      </div>

      {/* System Components Status */}
      <div class="space-y-2 mb-6">
        <div class="text-sm font-semibold text-neutral-800">
          System Components
        </div>
        <div class="max-h-64 overflow-y-auto space-y-2">
          <For each={systemStatus()}>
            {(item) => (
              <div class="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-neutral-200">
                <div class="flex items-center gap-3">
                  <div
                    class={`w-3 h-3 rounded-full ${
                      item.status === "online" || item.status === "active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span class="text-sm text-neutral-700">{item.name}</span>
                </div>
                <div class="text-right">
                  <StatusBadge status={item.status} />
                  <div class="text-xs text-neutral-500 mt-1">{item.uptime}</div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="text-xs text-neutral-500 mb-4">
        Last Security Scan: {securityMetrics().lastSecurityScan}
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button class="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-sm flex items-center justify-center gap-2">
          <svg
            width="14"
            height="14"
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
          Security Scan
        </button>
        <button class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-sm flex items-center justify-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            class="text-white"
          >
            <path
              d="M3 3v5h5M6 17l4-4 4 4M20 6l-2 2M14 6h6V0M18 18V6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1"
              fill="currentColor"
            />
          </svg>
          Detailed Report
        </button>
      </div>
    </Card>
  );
};

// Main Security Content Component
const SecurityContent = () => {
  return (
    <div class="space-y-6">
      {/* Top Row - Camera System spanning 2 columns and Face Recognition */}
      <div class="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-6">
        <AdvancedCameraSystem />
        <FaceRecognitionSystem />
      </div>

      {/* Bottom Row - Suspicious Activity (larger) and System Status (right corner) */}
      <div class="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
        <div class="xl:col-span-3 lg:col-span-2">
          <SuspiciousActivityDetection />
        </div>
        <div class="xl:col-span-1 lg:col-span-1">
          <SystemSecurityStatus />
        </div>
      </div>

      {/* Charts Section */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityAnalyticsChart />
        <ThreatLevelChart />
      </div>
    </div>
  );
};

// Main Security Component
const Security = () => {
  return (
    <Layout>
      <div class="space-y-8">
        {/* Header */}
        <div class="bg-gradient-to-r from-red-600 via-rose-600 to-pink-700 rounded-2xl p-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">Security & Monitoring</h1>
              <p class="text-red-100 text-lg">
                Pantau sistem keamanan, CCTV, dan deteksi wajah secara real-time
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
          </div>
        </div>

        <SecurityContent />
      </div>
    </Layout>
  );
};

export default Security;

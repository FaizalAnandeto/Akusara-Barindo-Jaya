import { createSignal, For, createEffect } from "solid-js";
import { useSettings } from "../contexts/SettingsContext";
import { useLanguage } from "../contexts/LanguageContext";

// Security Analytics Chart with AmChart-style data visualization
export const SecurityAnalyticsChart = () => {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
  });

  const [chartData] = createSignal([
    { hour: "00:00", detections: 12, suspicious: 2, verified: 10 },
    { hour: "04:00", detections: 8, suspicious: 1, verified: 7 },
    { hour: "08:00", detections: 45, suspicious: 5, verified: 40 },
    { hour: "12:00", detections: 38, suspicious: 3, verified: 35 },
    { hour: "16:00", detections: 52, suspicious: 8, verified: 44 },
    { hour: "20:00", detections: 29, suspicious: 4, verified: 25 },
  ]);

  const [maxValue] = createSignal(60);

  return (
    <div class="theme-card rounded-2xl p-6 shadow-xl border">
      <div class="mb-4">
        <h3 class="text-lg font-semibold theme-text-primary mb-1 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Security Analytics - 24H Overview
        </h3>
        <p class="text-sm theme-text-secondary">
          Real-time detection and verification trends
        </p>
      </div>

      {/* Chart Legend */}
      <div class="flex gap-4 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span class="text-xs theme-text-secondary">Total Detections</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span class="text-xs theme-text-secondary">Verified</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-rose-500 rounded-full"></div>
          <span class="text-xs theme-text-secondary">Suspicious</span>
        </div>
      </div>

      {/* Custom Bar Chart */}
      <div class="relative h-64 bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
        <div class="h-full flex items-end justify-between">
          <For each={chartData()}>
            {(data) => {
              const detectionHeight = (data.detections / maxValue()) * 100;
              const verifiedHeight = (data.verified / maxValue()) * 100;
              const suspiciousHeight = (data.suspicious / maxValue()) * 100;

              return (
                <div class="flex flex-col items-center gap-2">
                  {/* Bars */}
                  <div class="relative flex items-end gap-1 h-48">
                    {/* Total Detections Bar */}
                    <div
                      class="w-4 bg-blue-500 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group"
                      style={`height: ${detectionHeight}%`}
                      title={`Total: ${data.detections}`}
                    >
                      <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 dark:bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.detections}
                      </div>
                    </div>

                    {/* Verified Bar */}
                    <div
                      class="w-4 bg-emerald-500 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group"
                      style={`height: ${verifiedHeight}%`}
                      title={`Verified: ${data.verified}`}
                    >
                      <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 dark:bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.verified}
                      </div>
                    </div>

                    {/* Suspicious Bar */}
                    <div
                      class="w-4 bg-rose-500 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group"
                      style={`height: ${suspiciousHeight}%`}
                      title={`Suspicious: ${data.suspicious}`}
                    >
                      <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-neutral-800 dark:bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.suspicious}
                      </div>
                    </div>
                  </div>

                  {/* Hour Label */}
                  <span class="text-xs theme-text-tertiary font-medium">
                    {data.hour}
                  </span>
                </div>
              );
            }}
          </For>
        </div>

        {/* Y-axis labels */}
        <div class="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs theme-text-tertiary">
          <span>{maxValue()}</span>
          <span>{Math.floor(maxValue() * 0.75)}</span>
          <span>{Math.floor(maxValue() * 0.5)}</span>
          <span>{Math.floor(maxValue() * 0.25)}</span>
          <span>0</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div class="grid grid-cols-3 gap-3 mt-4">
        <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-blue-700 dark:text-blue-400">
            {chartData().reduce((sum, data) => sum + data.detections, 0)}
          </div>
          <div class="text-xs text-blue-600 dark:text-blue-400">{t('totalToday')}</div>
        </div>
        <div class="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-emerald-700 dark:text-emerald-400">
            {chartData().reduce((sum, data) => sum + data.verified, 0)}
          </div>
          <div class="text-xs text-emerald-600 dark:text-emerald-400">{t('verified')}</div>
        </div>
        <div class="bg-rose-50 dark:bg-rose-900/30 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-rose-700 dark:text-rose-400">
            {chartData().reduce((sum, data) => sum + data.suspicious, 0)}
          </div>
          <div class="text-xs text-rose-600 dark:text-rose-400">{t('suspicious')}</div>
        </div>
      </div>
    </div>
  );
};

// Threat Level Pie Chart
export const ThreatLevelChart = () => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
  });

  const [threatData] = createSignal([
    {
      level: "Low",
      count: 145,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500",
    },
    {
      level: "Medium",
      count: 23,
      color: "text-amber-500",
      bgColor: "bg-amber-500",
    },
    { level: "High", count: 8, color: "text-rose-500", bgColor: "bg-rose-500" },
    {
      level: "Critical",
      count: 2,
      color: "text-red-700",
      bgColor: "bg-red-700",
    },
  ]);

  const totalThreats = () =>
    threatData().reduce((sum, item) => sum + item.count, 0);

  return (
    <div class="theme-card rounded-2xl p-6 shadow-xl border">
      <div class="mb-4">
        <h3 class="text-lg font-semibold theme-text-primary mb-1 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Threat Level Distribution
        </h3>
        <p class="text-sm theme-text-secondary">
          Current security threat classification
        </p>
      </div>

      {/* Circular Progress Chart */}
      <div class="flex justify-center mb-4">
        <div class="relative w-32 h-32">
          <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              class={currentTheme() === 'dark' ? 'text-slate-600' : 'text-neutral-200'}
            />

            {/* Threat level arcs */}
            <For each={threatData()}>
              {(threat, index) => {
                const percentage = (threat.count / totalThreats()) * 100;
                const strokeDasharray = `${percentage * 2.51} 251.2`;
                const strokeDashoffset = -index() * percentage * 2.51;

                return (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    stroke-width="8"
                    fill="none"
                    stroke-dasharray={strokeDasharray}
                    stroke-dashoffset={strokeDashoffset}
                    class={threat.color}
                    opacity="0.8"
                  />
                );
              }}
            </For>
          </svg>

          {/* Center text */}
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-xl font-bold theme-text-primary">
                {totalThreats()}
              </div>
              <div class="text-xs theme-text-tertiary">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div class="space-y-2">
        <For each={threatData()}>
          {(threat) => {
            const percentage = ((threat.count / totalThreats()) * 100).toFixed(
              1
            );
            return (
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class={`w-3 h-3 rounded-full ${threat.bgColor}`}></div>
                  <span class="text-sm theme-text-secondary">{threat.level}</span>
                </div>
                <div class="text-right">
                  <span class="text-sm font-medium theme-text-primary">
                    {threat.count}
                  </span>
                  <span class="text-xs theme-text-tertiary ml-1">
                    ({percentage}%)
                  </span>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};

import { Component, createSignal, For, Show, createEffect } from "solid-js";
import { useSettings } from "../contexts/SettingsContext";
import { useLanguage } from "../contexts/LanguageContext";
import Layout from "../layouts/Layout";

// Enhanced Card Component
const Card: Component<{ children: any; class?: string }> = (props) => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
    console.log('Finance Card theme updated to:', settings().theme);
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

// Status Badge Component
const StatusBadge: Component<{ status: string }> = (props) => {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);
  
  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
  });

  const getStatusColor = () => {
    const isDark = currentTheme() === 'dark';
    switch (props.status.toLowerCase()) {
      case "paid":
        return isDark ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-800";
      case "pending":
        return isDark ? "bg-yellow-900/50 text-yellow-400" : "bg-yellow-100 text-yellow-800";
      case "unpaid":
        return isDark ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-800";
      default:
        return "theme-bg-subtle theme-text-secondary";
    }
  };

  const getStatusText = () => {
    switch (props.status.toLowerCase()) {
      case "paid":
        return t("paid");
      case "pending":
        return t("pending");
      case "unpaid":
        return t("unpaid");
      default:
        return props.status;
    }
  };

  return (
    <span
      class={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {getStatusText()}
    </span>
  );
};

// Finance Overview Component
const FinanceOverview: Component = () => {
  const { t } = useLanguage();
  const [financeData] = createSignal({
    totalIuran: 125000000,
    paidPercentage: 78,
    unpaidPercentage: 22,
    outstandingBalance: 27500000,
    totalResidents: 156,
    paidResidents: 122,
    unpaidResidents: 34,
    thisMonth: "Agustus 2025",
  });

  return (
    <Card>
      <div class="mb-6">
        <div class="text-xl font-bold theme-text-primary mb-2 flex items-center gap-3">
          <div class="bg-gradient-to-r from-green-600 to-emerald-700 p-3 rounded-xl shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <path
                d="M12 1v6m0 0L9 4m3 3l3-3M1 12h6m0 0L4 9m3 3l-3 3m14-3h6m0 0l-3-3m3 3l-3 3M12 23v-6m0 0l3 3m-3-3l-3 3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          {t("financeManagement")} - {financeData().thisMonth}
        </div>
        <div class="text-sm theme-text-secondary">
          {t("financeDescription")}
        </div>
      </div>

      {/* Summary Cards */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
          <div class="flex items-center justify-between mb-3">
            <div class="bg-green-600 p-2 rounded-lg">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                class="text-white"
              >
                <path
                  d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="text-2xl">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                class="text-green-600"
              >
                <path
                  d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>
          <div class="text-2xl font-bold text-green-700 mb-1">
            Rp {financeData().totalIuran.toLocaleString("id-ID")}
          </div>
          <div class="text-sm text-green-600">{t("totalIuranThisMonth")}</div>
        </div>

        <div class="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200">
          <div class="flex items-center justify-between mb-3">
            <div class="bg-blue-600 p-2 rounded-lg">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                class="text-white"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="text-2xl">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                class="text-blue-600"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>
          <div class="text-2xl font-bold text-blue-700 mb-1">
            {financeData().paidPercentage}%
          </div>
          <div class="text-sm text-blue-600">
            {t("sudahBayar")} ({financeData().paidResidents} {t("warga")})
          </div>
        </div>

        <div class="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-4 border border-red-200">
          <div class="flex items-center justify-between mb-3">
            <div class="bg-red-600 p-2 rounded-lg">
              <svg
                width="20"
                height="20"
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
                <line
                  x1="15"
                  y1="9"
                  x2="9"
                  y2="15"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <line
                  x1="9"
                  y1="9"
                  x2="15"
                  y2="15"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <span class="text-2xl">
              <svg
                width="24"
                height="24"
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
            </span>
          </div>
          <div class="text-2xl font-bold text-red-700 mb-1">
            Rp {financeData().outstandingBalance.toLocaleString("id-ID")}
          </div>
          <div class="text-sm text-red-600">
            {t("outstandingBalance")} ({financeData().unpaidResidents} {t("warga")})
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-4 border border-purple-200">
          <div class="flex items-center justify-between mb-3">
            <div class="bg-purple-600 p-2 rounded-lg">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                class="text-white"
              >
                <path
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <span class="text-2xl">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                class="text-purple-600"
              >
                <path
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </span>
          </div>
          <div class="text-2xl font-bold text-purple-700 mb-1">
            {financeData().totalResidents}
          </div>
          <div class="text-sm text-purple-600">{t("totalResidents")}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div class="mb-6">
        <div class="flex justify-between text-sm font-medium theme-text-primary mb-2">
          <span>Progress Pembayaran</span>
          <span>{financeData().paidPercentage}% {t('complete')}</span>
        </div>
        <div class="w-full theme-bg-subtle rounded-full h-3">
          <div
            class="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-700 ease-out"
            style={`width: ${financeData().paidPercentage}%`}
          ></div>
        </div>
      </div>

      {/* Export Buttons */}
      <div class="flex flex-wrap gap-3">
        <button class="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2">
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
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="14,2 14,8 20,8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="16"
              y1="13"
              x2="8"
              y2="13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <line
              x1="16"
              y1="17"
              x2="8"
              y2="17"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <polyline
              points="10,9 9,9 8,9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Export PDF
        </button>

        <button class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2">
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
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="14,2 14,8 20,8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="12"
              y1="18"
              x2="12"
              y2="12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <line
              x1="9"
              y1="15"
              x2="15"
              y2="15"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          Export Excel
        </button>
      </div>
    </Card>
  );
};

// Payment Status Component
const PaymentStatus: Component = () => {
  const { t } = useLanguage();
  const [residents] = createSignal([
    {
      id: 1,
      name: "Ahmad Wijaya",
      block: "A-12",
      amount: 800000,
      status: "paid",
      dueDate: "31 Agustus 2025",
      paymentDate: "25 Agustus 2025",
      method: "Transfer Bank",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      block: "B-05",
      amount: 800000,
      status: "pending",
      dueDate: "31 Agustus 2025",
      paymentDate: "28 Agustus 2025",
      method: "QRIS",
    },
    {
      id: 3,
      name: "Budi Santoso",
      block: "C-18",
      amount: 800000,
      status: "unpaid",
      dueDate: "31 Agustus 2025",
      paymentDate: "-",
      method: "-",
    },
    {
      id: 4,
      name: "Lisa Andriani",
      block: "D-07",
      amount: 800000,
      status: "paid",
      dueDate: "31 Agustus 2025",
      paymentDate: "20 Agustus 2025",
      method: t("eWallet"),
    },
    {
      id: 5,
      name: "Rudi Hermawan",
      block: "A-03",
      amount: 800000,
      status: "unpaid",
      dueDate: "31 Agustus 2025",
      paymentDate: "-",
      method: "-",
    },
  ]);

  const [filterStatus, setFilterStatus] = createSignal("all");

  // Update filter status when language changes
  createEffect(() => {
    if (filterStatus() === "all") {
      // Re-trigger reactivity when language changes
      t("all");
    }
  });

  const filteredResidents = () => {
    if (filterStatus() === "all") return residents();
    return residents().filter((resident) => resident.status === filterStatus());
  };

  return (
    <Card>
      <div class="mb-6">
        <div class="text-xl font-bold theme-text-primary mb-2 flex items-center gap-3">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-xl shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <path
                d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          {t("paymentStatusManagement")}
        </div>
        <div class="text-sm theme-text-secondary">
          {t("paymentStatusDescription")}
        </div>
      </div>

      {/* Filter Buttons */}
      <div class="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setFilterStatus("all")}
          class={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            filterStatus() === "all"
              ? "bg-blue-600 text-white shadow-lg"
              : "theme-bg-subtle theme-text-primary"
          }`}
        >
          {t("all")} ({residents().length})
        </button>
        <button
          onClick={() => setFilterStatus("paid")}
          class={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            filterStatus() === "paid"
              ? "bg-green-600 text-white shadow-lg"
              : "theme-bg-subtle theme-text-primary"
          }`}
        >
          {t("paid")} ({residents().filter((r) => r.status === "paid").length})
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          class={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            filterStatus() === "pending"
              ? "bg-yellow-600 text-white shadow-lg"
              : "theme-bg-subtle theme-text-primary"
          }`}
        >
          {t("pending")} ({residents().filter((r) => r.status === "pending").length})
        </button>
        <button
          onClick={() => setFilterStatus("unpaid")}
          class={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            filterStatus() === "unpaid"
              ? "bg-red-600 text-white shadow-lg"
              : "theme-bg-subtle theme-text-primary"
          }`}
        >
          {t("unpaid")} ({residents().filter((r) => r.status === "unpaid").length})
        </button>
      </div>

      {/* Residents Table */}
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="theme-bg-subtle border-b theme-border">
              <th class="text-left p-4 font-semibold theme-text-primary">
                {t("residents")}
              </th>
              <th class="text-left p-4 font-semibold theme-text-primary">
                Blok/Unit
              </th>
              <th class="text-left p-4 font-semibold theme-text-primary">
                Nominal
              </th>
              <th class="text-left p-4 font-semibold theme-text-primary">
                Status
              </th>
              <th class="text-left p-4 font-semibold theme-text-primary">
                Metode
              </th>
              <th class="text-left p-4 font-semibold theme-text-primary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={filteredResidents()}>
              {(resident) => (
                <tr class="border-b theme-border transition-colors">
                  <td class="p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {resident.name.charAt(0)}
                      </div>
                      <div>
                        <div class="font-medium theme-text-primary">
                          {resident.name}
                        </div>
                        <div class="text-sm theme-text-secondary">
                          Due: {resident.dueDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="p-4">
                    <span class="font-medium theme-text-primary">
                      {resident.block}
                    </span>
                  </td>
                  <td class="p-4">
                    <span class="font-bold text-green-700">
                      Rp {resident.amount.toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td class="p-4">
                    <StatusBadge status={resident.status} />
                  </td>
                  <td class="p-4">
                    <span class="text-sm theme-text-secondary">
                      {resident.method}
                    </span>
                  </td>
                  <td class="p-4">
                    <div class="flex items-center gap-2">
                      <button class="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="text-blue-600"
                        >
                          <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            stroke="currentColor"
                            stroke-width="2"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            stroke-width="2"
                          />
                        </svg>
                        View
                      </button>

                      <Show when={resident.status === "unpaid"}>
                        <button class="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="text-orange-600"
                          >
                            <path
                              d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          Remind
                        </button>
                      </Show>

                      <Show when={resident.status === "pending"}>
                        <button class="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="text-green-600"
                          >
                            <path
                              d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          Approve
                        </button>
                      </Show>
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

// Transaction History Component
const TransactionHistory: Component = () => {
  const { t } = useLanguage();
  const [transactions] = createSignal([
    {
      id: "TXN-001",
      resident: "Ahmad Wijaya",
      block: "A-12",
      amount: 800000,
      type: "Monthly Fee",
      method: "Transfer Bank",
      date: "25 Agustus 2025",
      time: "14:30",
      status: "completed",
    },
    {
      id: "TXN-002",
      resident: "Lisa Andriani",
      block: "D-07",
      amount: 800000,
      type: "Monthly Fee",
      method: t("eWallet"),
      date: "20 Agustus 2025",
      time: "09:15",
      status: "completed",
    },
    {
      id: "TXN-003",
      resident: "Siti Nurhaliza",
      block: "B-05",
      amount: 800000,
      type: "Monthly Fee",
      method: "QRIS",
      date: "28 Agustus 2025",
      time: "16:45",
      status: "pending",
    },
    {
      id: "TXN-004",
      resident: "Muhammad Rizki",
      block: "C-22",
      amount: 1200000,
      type: "Security Deposit",
      method: "Transfer Bank",
      date: "15 Agustus 2025",
      time: "11:20",
      status: "completed",
    },
    {
      id: "TXN-005",
      resident: "Diana Putri",
      block: "A-08",
      amount: 800000,
      type: "Monthly Fee",
      method: "Cash",
      date: "10 Agustus 2025",
      time: "13:00",
      status: "completed",
    },
  ]);

  return (
    <Card>
      <div class="mb-6">
        <div class="text-xl font-bold theme-text-primary mb-2 flex items-center gap-3">
          <div class="bg-gradient-to-r from-purple-600 to-pink-700 p-3 rounded-xl shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <path
                d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          Transaction History
        </div>
        <div class="text-sm theme-text-secondary">
          Riwayat transaksi dan pembayaran terbaru
        </div>
      </div>

      {/* Filter by Month/Year */}
      <div class="flex flex-wrap gap-3 mb-6">
        <select class="theme-card border theme-border rounded-lg px-4 py-2 theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Agustus 2025</option>
          <option>Juli 2025</option>
          <option>Juni 2025</option>
          <option>Mei 2025</option>
        </select>

        <select class="theme-card border theme-border rounded-lg px-4 py-2 theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Semua Jenis</option>
          <option>Monthly Fee</option>
          <option>Security Deposit</option>
          <option>Maintenance Fee</option>
        </select>
      </div>

      {/* Transaction Timeline */}
      <div class="space-y-4">
        <For each={transactions()}>
          {(transaction) => (
            <div class="theme-card rounded-xl p-4 border theme-border hover:shadow-md transition-all duration-200">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div
                    class={`w-3 h-3 rounded-full ${
                      transaction.status === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <div>
                    <div class="font-semibold theme-text-primary">
                      {transaction.resident} • {transaction.block}
                    </div>
                    <div class="text-sm theme-text-secondary">
                      {transaction.id} • {transaction.type}
                    </div>
                  </div>
                </div>

                <div class="text-right">
                  <div class="font-bold text-green-700">
                    Rp {transaction.amount.toLocaleString("id-ID")}
                  </div>
                  <div class="text-sm theme-text-secondary">
                    {transaction.date} • {transaction.time}
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-sm theme-text-secondary">
                    Payment Method: {transaction.method}
                  </span>
                </div>

                <StatusBadge status={transaction.status} />
              </div>
            </div>
          )}
        </For>
      </div>
    </Card>
  );
};

// Add Transaction Component
const AddTransaction: Component = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = createSignal({
    resident: "",
    block: "",
    amount: "",
    type: "monthly",
    method: "cash",
    notes: "",
  });

  return (
    <Card>
      <div class="mb-6">
        <div class="text-xl font-bold theme-text-primary mb-2 flex items-center gap-3">
          <div class="bg-gradient-to-r from-indigo-600 to-blue-700 p-3 rounded-xl shadow-lg">
            <svg
              width="24"
              height="24"
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
              <line
                x1="12"
                y1="8"
                x2="12"
                y2="16"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="8"
                y1="12"
                x2="16"
                y2="12"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </div>
          Add Manual Transaction
        </div>
        <div class="text-sm theme-text-secondary">
          Input pembayaran manual (transfer tunai, offline payment)
        </div>
      </div>

      <form class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">
              {t("namaWarga")}
            </label>
            <input
              type="text"
              placeholder={t("enterResidentName")}
              class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">
              Blok/Unit
            </label>
            <input
              type="text"
              placeholder="Contoh: A-12"
              class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">
              Nominal (Rp)
            </label>
            <input
              type="number"
              placeholder="800000"
              class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">
              Jenis Pembayaran
            </label>
            <select class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="monthly">Iuran Bulanan</option>
              <option value="security">Security Deposit</option>
              <option value="maintenance">Maintenance Fee</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium theme-text-primary mb-2">
            Metode Pembayaran
          </label>
          <select class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="cash">Cash (Tunai)</option>
            <option value="transfer">Transfer Bank</option>
            <option value="ewallet">{t("eWallet")}</option>
            <option value="qris">QRIS</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium theme-text-primary mb-2">
            Catatan (Opsional)
          </label>
          <textarea
            placeholder="Tambahkan catatan jika diperlukan..."
            rows="3"
            class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            class="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Simpan Transaksi
          </button>

          <button
            type="button"
            class="theme-bg-subtle theme-text-primary px-6 py-3 rounded-xl font-medium transition-all duration-300"
          >
            Reset Form
          </button>
        </div>
      </form>
    </Card>
  );
};

// Payment Integration Component
const PaymentIntegration: Component = () => {
  const { t } = useLanguage();
  const [integrationStatus] = createSignal({
    qris: { connected: true, lastSync: "2 menit yang lalu" },
    bankTransfer: { connected: true, lastSync: "5 menit yang lalu" },
    ewallet: { connected: false, lastSync: t("notConnected") },
    onlineGateway: { connected: true, lastSync: "1 menit yang lalu" },
  });

  return (
    <Card>
      <div class="mb-6">
        <div class="text-xl font-bold theme-text-primary mb-2 flex items-center gap-3">
          <div class="bg-gradient-to-r from-cyan-600 to-teal-700 p-3 rounded-xl shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              class="text-white"
            >
              <rect
                x="1"
                y="4"
                width="22"
                height="16"
                rx="2"
                ry="2"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="1"
                y1="10"
                x2="23"
                y2="10"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </div>
          Payment Integration
        </div>
        <div class="text-sm theme-text-secondary">
          Status integrasi sistem pembayaran online
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="theme-card rounded-xl p-4 border theme-border">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="text-blue-600"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="12"
                    rx="2"
                    fill="currentColor"
                  />
                  <rect x="5" y="6" width="14" height="2" fill="white" />
                  <rect x="5" y="10" width="8" height="2" fill="white" />
                </svg>
              </div>
              <div>
                <div class="font-semibold theme-text-primary">QRIS Payment</div>
                <div class="text-sm theme-text-secondary">
                  Quick Response Indonesia Standard
                </div>
              </div>
            </div>
            <div
              class={`w-3 h-3 rounded-full ${
                integrationStatus().qris.connected
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
          <div class="text-xs text-neutral-300">
            Last Sync: {integrationStatus().qris.lastSync}
          </div>
        </div>

        <div class="theme-card rounded-xl p-4 border theme-border">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="text-green-600"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    fill="currentColor"
                  />
                  <polyline
                    points="14,2 14,8 20,8"
                    stroke="white"
                    stroke-width="2"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="white"
                    stroke-width="2"
                  />
                  <line
                    x1="16"
                    y1="17"
                    x2="8"
                    y2="17"
                    stroke="white"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div>
                <div class="font-semibold theme-text-primary">Bank Transfer</div>
                <div class="text-sm theme-text-secondary">
                  Automatic bank integration
                </div>
              </div>
            </div>
            <div
              class={`w-3 h-3 rounded-full ${
                integrationStatus().bankTransfer.connected
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
          <div class="text-xs text-neutral-300">
            Last Sync: {integrationStatus().bankTransfer.lastSync}
          </div>
        </div>

        <div class="theme-card rounded-xl p-4 border theme-border">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="text-purple-600"
                >
                  <path
                    d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 6v6l4 2"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div>
                <div class="font-semibold theme-text-primary">{t("eWallet")}</div>
                <div class="text-sm theme-text-secondary">
                  GoPay, OVO, DANA, ShopeePay
                </div>
              </div>
            </div>
            <div
              class={`w-3 h-3 rounded-full ${
                integrationStatus().ewallet.connected
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
          <div class="text-xs text-neutral-300">
            Last Sync: {integrationStatus().ewallet.lastSync}
          </div>
        </div>

        <div class="theme-card rounded-xl p-4 border theme-border">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="text-orange-600"
                >
                  <circle cx="12" cy="12" r="10" fill="currentColor" />
                  <path
                    d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div>
                <div class="font-semibold theme-text-primary">Online Gateway</div>
                <div class="text-sm theme-text-secondary">
                  Midtrans, Xendit, PayPal
                </div>
              </div>
            </div>
            <div
              class={`w-3 h-3 rounded-full ${
                integrationStatus().onlineGateway.connected
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
          <div class="text-xs text-neutral-200">
            Last Sync: {integrationStatus().onlineGateway.lastSync}
          </div>
        </div>
      </div>

      <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div class="flex items-center gap-3 mb-2">
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
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M12 16v-4M12 8h.01"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="font-semibold text-blue-800">Auto-Update Feature</div>
        </div>
        <div class="text-sm text-blue-700">
          Sistem akan otomatis memperbarui status pembayaran ketika transaksi
          berhasil melalui payment gateway yang terintegrasi.
        </div>
      </div>
    </Card>
  );
};

// Main Finance Component
const Finance: Component = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div class="space-y-8">
        {/* Header */}
        <Card class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("financeManagement")}</h1>
              <p class="text-gray-600 dark:text-slate-300 text-lg">
                {t("financeDescription")}
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
                  d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* Finance Overview */}
        <FinanceOverview />

        {/* Payment Status */}
        <PaymentStatus />

        {/* Bottom Section: 2 Columns */}
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Transaction History */}
          <TransactionHistory />

          {/* Add Transaction */}
          <AddTransaction />
        </div>

        {/* Payment Integration */}
        <PaymentIntegration />
      </div>
    </Layout>
  );
};

export default Finance;

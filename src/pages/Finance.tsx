import {
  Component,
  createSignal,
  For,
  Show,
  createEffect,
  onMount,
  onCleanup,
} from "solid-js";
import { useSettings } from "../contexts/SettingsContext";
import { useLanguage } from "../contexts/LanguageContext";
import Layout from "../layouts/Layout";
import {
  fetchFinanceOverview,
  fetchResidents,
  fetchTransactions,
  approveResident,
  unapproveResident,
  deleteTransaction,
  remindResident,
  addTransaction,
  exportTransactionsCSV,
  exportTransactionsPDF,
  exportTransactionsExcelXLS,
  fetchFinanceState,
} from "../services/finance";

// Enhanced Card Component
const Card: Component<{ children: any; class?: string }> = (props) => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = createSignal(settings().theme);

  // Update theme reactively
  createEffect(() => {
    setCurrentTheme(settings().theme);
    console.log("Finance Card theme updated to:", settings().theme);
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
    const isDark = currentTheme() === "dark";
    switch (props.status.toLowerCase()) {
      case "paid":
        return isDark
          ? "bg-green-900/50 text-green-400"
          : "bg-green-100 text-green-800";
      case "pending":
        return isDark
          ? "bg-yellow-900/50 text-yellow-400"
          : "bg-yellow-100 text-yellow-800";
      case "unpaid":
        return isDark
          ? "bg-red-900/50 text-red-400"
          : "bg-red-100 text-red-800";
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
  const [financeData, setFinanceData] = createSignal<any>({
    totalIuran: 0,
    paidPercentage: 0,
    unpaidPercentage: 0,
    outstandingBalance: 0,
    totalResidents: 0,
    paidResidents: 0,
    unpaidResidents: 0,
    thisMonth: "-",
  });
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setFinanceData(await fetchFinanceOverview());
    } catch (e: any) {
      setError(e?.message || "Gagal memuat ringkasan");
    } finally {
      setLoading(false);
    }
  };
  onMount(() => {
    load();
    const refreshHandler = () => load();
    const overviewUpdateHandler = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail && typeof custom.detail === "object") {
        setFinanceData((prev: any) => ({ ...prev, ...custom.detail }));
      }
      // Safety re-fetch to ensure backend state matches
      load();
      setTimeout(() => load(), 150); // double-check after small delay
    };
    window.addEventListener("finance:refresh", refreshHandler);
    window.addEventListener(
      "finance:overview:update",
      overviewUpdateHandler as any
    );
    onCleanup(() => {
      window.removeEventListener("finance:refresh", refreshHandler);
      window.removeEventListener(
        "finance:overview:update",
        overviewUpdateHandler as any
      );
    });
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
        <Show when={loading()}>
          <div class="text-xs theme-text-secondary mt-1">
            {t("loading") || "Loading..."}
          </div>
        </Show>
        <Show when={error()}>
          <div class="text-xs text-red-600 mt-1">{error()}</div>
        </Show>
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
            {t("outstandingBalance")} ({financeData().unpaidResidents}{" "}
            {t("warga")})
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
          <span>{t("paymentProgress")}</span>
          <span>
            {financeData().paidPercentage}% {t("complete")}
          </span>
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
        <button
          class="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
          onClick={() => exportTransactionsPDF()}
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
          {t("exportPdf")}
        </button>

        <button
          class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
          onClick={() => exportTransactionsExcelXLS()}
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
          {t("exportExcel")}
        </button>
      </div>
    </Card>
  );
};

// Payment Status Component
const PaymentStatus: Component = () => {
  const { t } = useLanguage();
  const [residents, setResidents] = createSignal<any[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [showModal, setShowModal] = createSignal(false);
  const [modalResident, setModalResident] = createSignal<any | null>(null);
  const [modalTx, setModalTx] = createSignal<any[]>([]);
  const [modalLoading, setModalLoading] = createSignal(false);
  const [modalError, setModalError] = createSignal<string | null>(null);
  const [busyId, setBusyId] = createSignal<number | null>(null);

  const load = async (unified = false) => {
    setLoading(true);
    setError(null);
    try {
      if (unified) {
        const state = await fetchFinanceState();
        setResidents(state.residents);
        // broadcast fresh overview if came via unified call
        window.dispatchEvent(
          new CustomEvent("finance:overview:update", { detail: state.overview })
        );
      } else {
        setResidents(await fetchResidents());
      }
    } catch (e: any) {
      setError(e?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };
  onMount(() => {
    load(true);
    const handler = () => !busyId() && load(true); // always unified to keep overview in sync
    window.addEventListener("finance:refresh", handler);
    onCleanup(() => window.removeEventListener("finance:refresh", handler));
  });

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

  const openView = async (resident: any) => {
    setModalResident(resident);
    setShowModal(true);
    setModalLoading(true);
    setModalError(null);
    try {
      const all = await fetchTransactions();
      const txs = all.filter(
        (t) => t.resident === resident.name && t.block === resident.block
      );
      setModalTx(txs);
    } catch (e: any) {
      setModalError(e?.message || "Gagal memuat transaksi");
    } finally {
      setModalLoading(false);
    }
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
        <Show when={loading()}>
          <div class="text-xs theme-text-secondary mt-1">
            {t("loading") || "Loading..."}
          </div>
        </Show>
        <Show when={error()}>
          <div class="text-xs text-red-600 mt-1">{error()}</div>
        </Show>
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
          {t("pending")} (
          {residents().filter((r) => r.status === "pending").length})
        </button>
        <button
          onClick={() => setFilterStatus("unpaid")}
          class={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            filterStatus() === "unpaid"
              ? "bg-red-600 text-white shadow-lg"
              : "theme-bg-subtle theme-text-primary"
          }`}
        >
          {t("unpaid")} (
          {residents().filter((r) => r.status === "unpaid").length})
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
                {t("blockUnit")}
              </th>
              <th class="text-left p-4 font-semibold theme-text-primary">
                {t("amount")}
              </th>
              <th class="text-left p-4 font-semibold theme-text-primary">
                {t("status")}
              </th>
              <th class="text-left p-4 font-semibold theme-text-primary">
                {t("paymentMethodLabel")}
              </th>
              <th class="text-left p-4 font-semibold theme-text-primary">
                {t("actions")}
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
                          {t("date")}: {resident.due_date}
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
                      <button
                        class="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                        onClick={() => openView(resident)}
                      >
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
                        {t("view")}
                      </button>

                      <Show when={resident.status === "unpaid"}>
                        <button
                          class="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors flex items-center gap-1"
                          disabled={busyId() === resident.id}
                          onClick={async () => {
                            try {
                              setBusyId(resident.id);
                              await remindResident(resident.id);
                              alert("Pengingat terkirim");
                            } catch (e) {
                              alert("Gagal mengirim pengingat");
                            } finally {
                              setBusyId(null);
                            }
                          }}
                        >
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
                          {t("remind")}
                        </button>
                      </Show>

                      <Show when={resident.status === "pending"}>
                        <button
                          class="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-1"
                          disabled={busyId() === resident.id}
                          onClick={async () => {
                            if (busyId()) return;
                            setBusyId(resident.id);
                            const id = resident.id;
                            try {
                              await approveResident(id);
                              // Optimistic local update to avoid flicker / extra clicks
                              setResidents((rs) =>
                                rs.map((r) =>
                                  r.id === id
                                    ? {
                                        ...r,
                                        status: "paid",
                                        payment_date:
                                          new Date().toLocaleDateString(
                                            "id-ID"
                                          ),
                                        method:
                                          r.method === "-"
                                            ? "Manual"
                                            : r.method,
                                      }
                                    : r
                                )
                              );
                              // Unified state reload to keep local list + overview in sync (single call to avoid race)
                              await load(true);
                            } catch (e) {
                              console.error("approve error", e);
                              alert("Gagal approve");
                            } finally {
                              setBusyId(null);
                            }
                          }}
                        >
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
                          {t("approve")}
                        </button>
                      </Show>

                      <Show when={resident.status === "paid"}>
                        <button
                          class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors flex items-center gap-1"
                          disabled={busyId() === resident.id}
                          onClick={async () => {
                            if (busyId()) return;
                            setBusyId(resident.id);
                            const id = resident.id;
                            try {
                              await unapproveResident(id);
                              // Optimistic local update to pending
                              setResidents((rs) =>
                                rs.map((r) =>
                                  r.id === id
                                    ? {
                                        ...r,
                                        status: "pending",
                                        payment_date: null,
                                      }
                                    : r
                                )
                              );
                              await load(true); // single unified reload
                            } catch (e) {
                              console.error("unapprove error", e);
                              alert("Gagal unapprove");
                            } finally {
                              setBusyId(null);
                            }
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="text-yellow-700"
                          >
                            <path
                              d="M9 12l2 2 4-4"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <line
                              x1="6"
                              y1="18"
                              x2="18"
                              y2="6"
                              stroke="currentColor"
                              stroke-width="2"
                            />
                          </svg>
                          Unapprove
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

      <Show when={showModal()}>
        <div
          class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div class="theme-card rounded-xl p-6 border theme-border max-w-2xl w-full">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {modalResident()?.name?.charAt(0)}
                </div>
                <div>
                  <div class="text-lg font-semibold theme-text-primary">
                    {modalResident()?.name}
                  </div>
                  <div class="text-sm theme-text-secondary">
                    {modalResident()?.block} • Rp{" "}
                    {modalResident()?.amount?.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <StatusBadge status={modalResident()?.status || "unpaid"} />
                <button
                  class="px-3 py-1 rounded-lg theme-bg-subtle theme-text-primary"
                  onClick={() => setShowModal(false)}
                >
                  Tutup
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="theme-card p-4 rounded-lg border theme-border">
                <div class="text-sm theme-text-secondary mb-1">
                  {t("paymentMethodLabel")}
                </div>
                <div class="font-medium theme-text-primary">
                  {modalResident()?.method}
                </div>
              </div>
              <div class="theme-card p-4 rounded-lg border theme-border">
                <div class="text-sm theme-text-secondary mb-1">{t("date")}</div>
                <div class="font-medium theme-text-primary">
                  {modalResident()?.payment_date || "-"}
                </div>
              </div>
            </div>

            <div class="mb-2 font-semibold theme-text-primary">
              {t("transactionHistory")}
            </div>
            <Show when={modalLoading()}>
              <div class="text-sm theme-text-secondary">
                {t("loading") || "Loading..."}
              </div>
            </Show>
            <Show when={modalError()}>
              <div class="text-sm text-red-600">{modalError()}</div>
            </Show>
            <div class="space-y-2 max-h-64 overflow-auto">
              <Show
                when={modalTx().length > 0}
                fallback={
                  <div class="text-sm theme-text-secondary">
                    {t("noData") || "Belum ada transaksi"}
                  </div>
                }
              >
                <For each={modalTx()}>
                  {(tx) => (
                    <div class="flex items-center justify-between theme-card p-3 rounded-lg border theme-border">
                      <div>
                        <div class="font-medium theme-text-primary">
                          {tx.type || tx.tx_type}
                        </div>
                        <div class="text-xs theme-text-secondary">
                          {tx.date} • {tx.time} • {tx.method}
                        </div>
                      </div>
                      <div class="font-semibold text-green-700">
                        Rp {tx.amount.toLocaleString("id-ID")}
                      </div>
                    </div>
                  )}
                </For>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </Card>
  );
};

// Transaction History Component
const TransactionHistory: Component = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = createSignal<any[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setTransactions(await fetchTransactions());
    } catch (e: any) {
      setError(e?.message || "Gagal memuat transaksi");
    } finally {
      setLoading(false);
    }
  };
  onMount(() => {
    load();
    const handler = () => load();
    window.addEventListener("finance:refresh", handler);
    onCleanup(() => window.removeEventListener("finance:refresh", handler));
  });

  const typeLabel = (type: string) => {
    switch (type) {
      case "Monthly Fee":
        return t("monthlyFee");
      case "Security Deposit":
        return t("securityDeposit");
      case "Maintenance Fee":
        return t("maintenanceFee");
      default:
        return type;
    }
  };

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
          {t("transactionHistory")}
        </div>
        <div class="text-sm theme-text-secondary">
          {t("transactionHistoryDesc")}
        </div>
        <Show when={loading()}>
          <div class="text-xs theme-text-secondary mt-1">
            {t("loading") || "Loading..."}
          </div>
        </Show>
        <Show when={error()}>
          <div class="text-xs text-red-600 mt-1">{error()}</div>
        </Show>
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
          <option>{t("allTypes")}</option>
          <option>{t("monthlyFee")}</option>
          <option>{t("securityDeposit")}</option>
          <option>{t("maintenanceFee")}</option>
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
                      {transaction.id} •{" "}
                      {typeLabel(transaction.type || transaction.tx_type)}
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
                    {t("paymentMethodLabel")}: {transaction.method}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <StatusBadge status={transaction.status} />
                  <button
                    class="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-1"
                    onClick={async () => {
                      try {
                        if (confirm("Hapus transaksi ini?")) {
                          await deleteTransaction(transaction.id);
                          await load();
                          window.dispatchEvent(
                            new CustomEvent("finance:refresh")
                          );
                        }
                      } catch {
                        alert("Gagal menghapus transaksi");
                      }
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      class="text-red-600"
                    >
                      <path
                        d="M3 6h18"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                      <path
                        d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                      <path
                        d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                      <path
                        d="M10 11v6M14 11v6"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </svg>
                    {t("delete") || "Delete"}
                  </button>
                </div>
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
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addTransaction({
        resident: formData().resident,
        block: formData().block,
        amount: Number(formData().amount || 0),
        type:
          formData().type === "monthly"
            ? "Monthly Fee"
            : formData().type === "security"
            ? "Security Deposit"
            : formData().type === "maintenance"
            ? "Maintenance Fee"
            : "Other",
        method:
          formData().method === "ewallet"
            ? "e-Wallet"
            : formData().method === "transfer"
            ? "Transfer Bank"
            : formData().method.toUpperCase(),
        notes: formData().notes || undefined,
      });
      alert(t("saveTransaction") + " ✓");
      // Optionally: trigger a custom event so parent widgets refresh (simple approach: reload window section)
      window.dispatchEvent(new CustomEvent("finance:refresh"));
      setFormData({
        resident: "",
        block: "",
        amount: "",
        type: "monthly",
        method: "cash",
        notes: "",
      });
    } catch (e: any) {
      setError(e?.message || "Gagal menyimpan transaksi");
    } finally {
      setSubmitting(false);
    }
  };

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
          {t("addManualTransaction")}
        </div>
        <div class="text-sm theme-text-secondary">
          {t("manualPaymentInputDesc")}
        </div>
      </div>

      <form class="space-y-4" onSubmit={onSubmit}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">
              {t("namaWarga")}
            </label>
            <input
              type="text"
              placeholder={t("enterResidentName")}
              class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData().resident}
              onInput={(e) =>
                setFormData({
                  ...formData(),
                  resident: (e.target as HTMLInputElement).value,
                })
              }
            />
          </div>

          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">
              {t("blockUnit")}
            </label>
            <input
              type="text"
              placeholder={t("blockUnitPlaceholder")}
              class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData().block}
              onInput={(e) =>
                setFormData({
                  ...formData(),
                  block: (e.target as HTMLInputElement).value,
                })
              }
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">
              {t("nominal")} (Rp)
            </label>
            <input
              type="number"
              placeholder="800000"
              class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData().amount}
              onInput={(e) =>
                setFormData({
                  ...formData(),
                  amount: (e.target as HTMLInputElement).value,
                })
              }
            />
          </div>

          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">
              {t("paymentType")}
            </label>
            <select
              class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData().type}
              onChange={(e) =>
                setFormData({
                  ...formData(),
                  type: (e.target as HTMLSelectElement).value,
                })
              }
            >
              <option value="monthly">{t("monthlyFee")}</option>
              <option value="security">{t("securityDeposit")}</option>
              <option value="maintenance">{t("maintenanceFee")}</option>
              <option value="other">{t("other")}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium theme-text-primary mb-2">
            {t("paymentMethodLabel")}
          </label>
          <select
            class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData().method}
            onChange={(e) =>
              setFormData({
                ...formData(),
                method: (e.target as HTMLSelectElement).value,
              })
            }
          >
            <option value="cash">{t("cash")}</option>
            <option value="transfer">{t("bankTransfer")}</option>
            <option value="ewallet">{t("eWallet")}</option>
            <option value="qris">QRIS</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium theme-text-primary mb-2">
            {t("notesOptional")}
          </label>
          <textarea
            placeholder={t("addNotePlaceholder")}
            rows="3"
            class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData().notes}
            onInput={(e) =>
              setFormData({
                ...formData(),
                notes: (e.target as HTMLTextAreaElement).value,
              })
            }
          ></textarea>
        </div>

        <div class="flex gap-3 pt-4">
          <Show when={error()}>
            <div class="text-sm text-red-600">{error()}</div>
          </Show>

          <button
            type="submit"
            disabled={submitting()}
            class={`bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              submitting()
                ? "opacity-60 cursor-not-allowed"
                : "hover:-translate-y-0.5 hover:shadow-lg"
            } flex items-center gap-2`}
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
            {t("saveTransaction")}
          </button>

          <button
            type="button"
            class="theme-bg-subtle theme-text-primary px-6 py-3 rounded-xl font-medium transition-all duration-300"
            onClick={() =>
              setFormData({
                resident: "",
                block: "",
                amount: "",
                type: "monthly",
                method: "cash",
                notes: "",
              })
            }
          >
            {t("resetForm")}
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
          {t("paymentIntegration")}
        </div>
        <div class="text-sm theme-text-secondary">
          {t("paymentIntegrationDesc")}
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
                <div class="font-semibold theme-text-primary">
                  {t("qrisPayment")}
                </div>
                <div class="text-sm theme-text-secondary">
                  {t("quickResponseIndonesiaStandard")}
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
            {t("lastSync")}: {integrationStatus().qris.lastSync}
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
                <div class="font-semibold theme-text-primary">
                  {t("bankTransfer")}
                </div>
                <div class="text-sm theme-text-secondary">
                  {t("automaticBankIntegration")}
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
            {t("lastSync")}: {integrationStatus().bankTransfer.lastSync}
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
                <div class="font-semibold theme-text-primary">
                  {t("eWallet")}
                </div>
                <div class="text-sm theme-text-secondary">
                  {t("popularEwallets")}
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
            {t("lastSync")}: {integrationStatus().ewallet.lastSync}
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
                <div class="font-semibold theme-text-primary">
                  {t("onlineGateway")}
                </div>
                <div class="text-sm theme-text-secondary">
                  {t("midtransXenditPaypal")}
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
            {t("lastSync")}: {integrationStatus().onlineGateway.lastSync}
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
          <div class="font-semibold text-blue-800">
            {t("autoUpdateFeature")}
          </div>
        </div>
        <div class="text-sm text-blue-700">{t("autoUpdateDesc")}</div>
      </div>
    </Card>
  );
};

// Main Finance Component
const Finance: Component = () => {
  const { t } = useLanguage();
  // Components listen to 'finance:refresh' and reload their own data.

  return (
    <Layout>
      <div class="space-y-8">
        {/* Header */}
        <Card class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t("financeManagement")}
              </h1>
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

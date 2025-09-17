const API_BASE_URL = "http://localhost:8080/api";

// Centralized helper so we can log failures consistently
async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[finance api] request failed", {
        url,
        status: res.status,
        body: text,
      });
      throw new Error(`Request failed (${res.status})`);
    }
    return res.json();
  } catch (err) {
    console.error("[finance api] network/error", { url, err });
    throw err;
  }
}

export interface FinanceOverview {
  totalIuran: number;
  paidPercentage: number;
  unpaidPercentage: number;
  outstandingBalance: number;
  totalResidents: number;
  paidResidents: number;
  unpaidResidents: number;
  thisMonth: string;
}

export interface Resident {
  id: number;
  name: string;
  block: string;
  amount: number;
  status: "paid" | "pending" | "unpaid";
  due_date: string;
  payment_date?: string | null;
  method: string;
}

export interface Transaction {
  id: string;
  resident: string;
  block: string;
  amount: number;
  type?: string; // FE convenience; backend uses tx_type
  tx_type?: string;
  method: string;
  date: string;
  time: string;
  status: "completed" | "pending";
}

// Unified state payload
export interface FinanceState {
  overview: FinanceOverview;
  residents: Resident[];
  transactions: Transaction[];
}

export async function fetchFinanceOverview(): Promise<FinanceOverview> {
  return fetchJson(`${API_BASE_URL}/finance/overview?ts=${Date.now()}`, {
    cache: "no-store",
  });
}

export async function fetchResidents(): Promise<Resident[]> {
  return fetchJson(`${API_BASE_URL}/finance/residents?ts=${Date.now()}`, {
    cache: "no-store",
  });
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const data: Transaction[] = await fetchJson(
    `${API_BASE_URL}/finance/transactions?ts=${Date.now()}`,
    { cache: "no-store" }
  );
  return data.map((t) => ({ ...t, type: (t as any).tx_type || t.type }));
}

export async function addTransaction(payload: {
  resident: string;
  block: string;
  amount: number;
  type: string;
  method: string;
  notes?: string;
}): Promise<{ id: string }> {
  return fetchJson(`${API_BASE_URL}/finance/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function approveResident(id: number): Promise<Resident> {
  return fetchJson(`${API_BASE_URL}/finance/residents/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function remindResident(id: number): Promise<{ status: string }> {
  return fetchJson(`${API_BASE_URL}/finance/residents/remind`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function unapproveResident(id: number): Promise<Resident> {
  return fetchJson(`${API_BASE_URL}/finance/residents/unapprove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function deleteTransaction(
  id: string
): Promise<{ status: string }> {
  return fetchJson(`${API_BASE_URL}/finance/transactions/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function fetchFinanceState(): Promise<FinanceState> {
  return fetchJson(`${API_BASE_URL}/finance/state?ts=${Date.now()}`, {
    cache: "no-store",
  });
}

// Simple client-side export helpers
export async function exportTransactionsCSV(): Promise<void> {
  const data = await fetchTransactions();
  const headers = [
    "ID",
    "Resident",
    "Block",
    "Amount",
    "Type",
    "Method",
    "Date",
    "Time",
    "Status",
  ];
  const rows = data.map((d) => [
    d.id,
    d.resident,
    d.block,
    d.amount,
    d.type || d.tx_type || "",
    d.method,
    d.date,
    d.time,
    d.status,
  ]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r
        .map((v) =>
          typeof v === "string" && v.includes(",")
            ? `"${v.replace(/"/g, '""')}"`
            : String(v)
        )
        .join(",")
    ),
  ].join("\n");
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]); // UTF-8 BOM for Excel
  const blob = new Blob([bom, csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportTransactionsPDF(): Promise<void> {
  const data = await fetchTransactions();
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Transactions</title>
  <style>body{font-family:Arial} table{border-collapse:collapse;width:100%} th,td{border:1px solid #ccc;padding:6px;font-size:12px} th{background:#f5f5f5}</style>
  </head><body><h2>Transactions</h2><table><thead><tr>
  <th>ID</th><th>Resident</th><th>Block</th><th>Amount</th><th>Type</th><th>Method</th><th>Date</th><th>Time</th><th>Status</th>
  </tr></thead><tbody>
  ${data
    .map(
      (d) =>
        `<tr><td>${d.id}</td><td>${d.resident}</td><td>${d.block}</td><td>${
          d.amount
        }</td><td>${d.type || d.tx_type || ""}</td><td>${d.method}</td><td>${
          d.date
        }</td><td>${d.time}</td><td>${d.status}</td></tr>`
    )
    .join("")}
  </tbody></table></body></html>`;
  // We download HTML which user can "Save as PDF" via browser dialog
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions_${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportTransactionsExcelXLS(): Promise<void> {
  const data = await fetchTransactions();
  const table = `<!doctype html><html><head><meta charset=\"utf-8\"></head><body><table border=1><thead><tr>
  <th>ID</th><th>Resident</th><th>Block</th><th>Amount</th><th>Type</th><th>Method</th><th>Date</th><th>Time</th><th>Status</th>
  </tr></thead><tbody>
  ${data
    .map(
      (d) =>
        `<tr><td>${d.id}</td><td>${d.resident}</td><td>${d.block}</td><td>${
          d.amount
        }</td><td>${d.type || d.tx_type || ""}</td><td>${d.method}</td><td>${
          d.date
        }</td><td>${d.time}</td><td>${d.status}</td></tr>`
    )
    .join("")}
  </tbody></table></body></html>`;
  const blob = new Blob([table], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions_${Date.now()}.xls`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

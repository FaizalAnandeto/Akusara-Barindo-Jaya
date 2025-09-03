export type SearchItem = {
  id: string;
  title: string; // Display label
  path: string; // Route path to navigate
  keywords: string[]; // Words to match (EN/ID)
};

// Core features across pages
export const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    keywords: ["dashboard", "ringkasan", "overview", "beranda", "home"],
  },
  {
    id: "security",
    title: "Security Monitoring",
    path: "/security",
    keywords: [
      "security",
      "keamanan",
      "cctv",
      "monitoring",
      "face",
      "recognition",
      "wajah",
      "akses",
    ],
  },
  {
    id: "finance",
    title: "Finance",
    path: "/finance",
    keywords: ["finance", "keuangan", "pembayaran", "tagihan", "biaya"],
  },
  {
    id: "osp",
    title: "OSP",
    path: "/osp",
    keywords: ["osp", "operational support", "operasional", "dukungan"],
  },
  {
    id: "settings",
    title: "Settings",
    path: "/settings",
    keywords: [
      "settings",
      "pengaturan",
      "tema",
      "theme",
      "bahasa",
      "language",
      "notifikasi",
      "notifications",
      "profile",
    ],
  },
  {
    id: "profile",
    title: "Profile",
    path: "/profile",
    keywords: ["profile", "profil", "akun", "user", "account"],
  },
  // Common actions/sections (navigate to best-fit page)
  {
    id: "open-cameras",
    title: "Open All Cameras",
    path: "/security",
    keywords: ["camera", "kamera", "open", "semua camera", "live"],
  },
  {
    id: "system-performance",
    title: "System Performance",
    path: "/dashboard",
    keywords: ["performance", "performa", "cpu", "memory", "storage"],
  },
  {
    id: "network-status",
    title: "Network Status",
    path: "/dashboard",
    keywords: ["network", "jaringan", "bandwidth", "latency", "uptime"],
  },
  {
    id: "recent-activities",
    title: "Recent Activities",
    path: "/dashboard",
    keywords: ["activities", "aktivitas", "logs", "update", "peristiwa"],
  },
  {
    id: "threat-detection",
    title: "Suspicious Activity Detection",
    path: "/security",
    keywords: ["threat", "ancaman", "suspicious", "mencurigakan", "alert"],
  },
  {
    id: "face-recognition",
    title: "Face Recognition",
    path: "/security",
    keywords: ["face", "wajah", "recognition", "akses", "kontrol"],
  },
];

export function searchItems(query: string, limit = 8): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = SEARCH_ITEMS.map((item) => {
    const hay = [item.title, ...item.keywords].join(" ").toLowerCase();
    const idx = hay.indexOf(q);
    const score = idx < 0 ? Infinity : idx; // earlier match = better
    return { item, score };
  }).filter((s) => s.score !== Infinity);

  scored.sort((a, b) => a.score - b.score || a.item.title.localeCompare(b.item.title));
  return scored.slice(0, limit).map((s) => s.item);
}

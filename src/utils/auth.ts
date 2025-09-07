// Utilities for handling the current user in localStorage and deriving display fields

export type StoredUser = Record<string, any> | null;

export type AppUser = {
  username: string;
  password?: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatar?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toTitleCase = (s: string) =>
  s
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");

const deriveFromUsername = (username: string) => {
  if (emailRegex.test(username)) {
    const [local] = username.split("@");
    return toTitleCase(local.replace(/[._-]+/g, " "));
  }
  return toTitleCase(username);
};

const initialsFrom = (nameOrEmail: string) => {
  let base = nameOrEmail;
  if (emailRegex.test(nameOrEmail)) {
    const [local] = nameOrEmail.split("@");
    base = local;
  }
  const parts = base.replace(/[._-]+/g, " ").trim().split(/\s+/);
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "");
  const init = letters.join("") || (nameOrEmail[0]?.toUpperCase() || "G");
  return init;
};

export const deriveUser = (raw: StoredUser): AppUser | null => {
  if (!raw || typeof raw !== "object") return null;
  // Common shapes: { username, password } or already enriched fields
  const username = String((raw as any).username || "") || "guest@localhost";
  const email = String((raw as any).email || (emailRegex.test(username) ? username : "guest@localhost"));
  const name = String((raw as any).name || deriveFromUsername(username));
  const role = String((raw as any).role || "User");
  const initials = String((raw as any).initials || initialsFrom(name || email));
  const password = (raw as any).password;
  const avatar = (raw as any).avatar as string | undefined;

  return { username, password, name, email, role, initials, avatar };
};

export const getStoredUser = (): AppUser | null => {
  try {
    const s = localStorage.getItem("user");
    if (!s) return null;
    const raw = JSON.parse(s) as StoredUser;
    return deriveUser(raw);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: any) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  // Notify same-tab listeners
  window.dispatchEvent(new CustomEvent("user-updated"));
  } catch {}
};

export const clearStoredUser = () => {
  try {
    localStorage.removeItem("user");
  window.dispatchEvent(new CustomEvent("user-updated"));
  } catch {}
};

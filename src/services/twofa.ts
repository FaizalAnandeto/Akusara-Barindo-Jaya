// 2FA API client
const API_BASE_URL = 'http://localhost:8080/api';

export interface TwoFAState { enabled: boolean; setupPending?: boolean }

function currentUsername(): string | null {
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    return u?.username || u?.email || null;
  } catch { return null; }
}

export async function fetchTwoFA(): Promise<TwoFAState> {
  const username = currentUsername();
  const qs = username ? `?username=${encodeURIComponent(username)}` : '';
  const res = await fetch(`${API_BASE_URL}/2fa${qs}`);
  if (!res.ok) throw new Error('Failed to load 2FA');
  return res.json();
}

export interface TwoFASetupResponse { otpauth_url: string; qr_svg: string }

export async function setupTwoFA(): Promise<TwoFASetupResponse> {
  const username = currentUsername();
  const res = await fetch(`${API_BASE_URL}/2fa/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error('Failed to setup 2FA');
  return res.json();
}

export async function verifyTwoFA(code: string): Promise<{ status: string }> {
  const username = currentUsername();
  const res = await fetch(`${API_BASE_URL}/2fa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, code }),
  });
  if (!res.ok) {
    let msg = 'verify_failed';
    try { const j = await res.json(); msg = j?.error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchQr(): Promise<TwoFASetupResponse> {
  const username = currentUsername();
  const qs = username ? `?username=${encodeURIComponent(username)}` : '';
  const res = await fetch(`${API_BASE_URL}/2fa/qr${qs}`);
  if (!res.ok) throw new Error('no_qr');
  return res.json();
}

export async function disableTwoFA(): Promise<{ status: string }> {
  const username = currentUsername();
  const res = await fetch(`${API_BASE_URL}/2fa/disable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error('Failed to disable 2FA');
  return res.json();
}

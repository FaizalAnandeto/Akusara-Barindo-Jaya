// Simple 2FA API client that talks to backend
const API_BASE_URL = 'http://localhost:8080/api';

export interface TwoFAState { enabled: boolean; setupPending?: boolean }

export async function fetchTwoFA(): Promise<TwoFAState> {
  const res = await fetch(`${API_BASE_URL}/2fa`);
  if (!res.ok) throw new Error('Failed to load 2FA');
  return res.json();
}

export async function setTwoFA(enabled: boolean): Promise<TwoFAState> {
  const res = await fetch(`${API_BASE_URL}/2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  if (!res.ok) throw new Error('Failed to update 2FA');
  return res.json();
}

export interface TwoFASetupResponse { otpauth_url: string; qr_svg: string }

export async function setupTwoFA(): Promise<TwoFASetupResponse> {
  const res = await fetch(`${API_BASE_URL}/2fa/setup`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to setup 2FA');
  return res.json();
}

export async function verifyTwoFA(code: string): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE_URL}/2fa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    let msg = 'verify_failed';
    try { const j = await res.json(); msg = j?.error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchQr(): Promise<TwoFASetupResponse> {
  const res = await fetch(`${API_BASE_URL}/2fa/qr`);
  if (!res.ok) throw new Error('no_qr');
  return res.json();
}

export async function disableTwoFA(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE_URL}/2fa/disable`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to disable 2FA');
  return res.json();
}

// src/lib/device.ts
// Manages the trusted-device token issued by the backend after successful 2FA.
// Stored in localStorage so it persists across sessions (30-day server-side expiry).

const DEVICE_TOKEN_KEY = 'clutch_device_token';

export function getDeviceToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(DEVICE_TOKEN_KEY);
}

export function setDeviceToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEVICE_TOKEN_KEY, token);
}

export function clearDeviceToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DEVICE_TOKEN_KEY);
}

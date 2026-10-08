import { useAuth } from "../state/authStore";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuth.getState().token;
  const multipart =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  const response = await fetch(`${API}/api${path}`, {
    ...init,
    headers: {
      ...(!multipart ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // Keep the HTTP status message when the server does not return JSON.
    }
    if (response.status === 401 && token) {
      // A token can outlive a local database reset. Remove it so protected
      // pages return to sign-in instead of rendering repeated 403 errors.
      useAuth.getState().clear();
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

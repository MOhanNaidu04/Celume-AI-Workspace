const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export function apiUrl(path) {
  if (import.meta.env.PROD && !API_BASE_URL) {
    console.warn('VITE_API_BASE_URL is not set. API requests will be sent to the frontend host.');
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

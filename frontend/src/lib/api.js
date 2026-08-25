import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ymb_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith('/bmsadmin') && !path.includes('/login')) {
        localStorage.removeItem('ymb_admin_token');
        localStorage.removeItem('ymb_admin');
        window.location.href = '/bmsadmin/login';
      } else if (path.startsWith('/admin') && !path.includes('/login')) {
        localStorage.removeItem('ymb_admin_token');
        localStorage.removeItem('ymb_admin');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatStops(stops = []) {
  return stops.map((s) => `${s.city} | ${s.time}`).join('\n');
}

export function parseStops(text = '') {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [city, time] = line.split('|').map((part) => part.trim());
      return { city: city || line, time: time || '' };
    });
}

export default api;

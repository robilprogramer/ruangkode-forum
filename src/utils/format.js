export function formatDate(date) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return 'Baru saja';
  const seconds = Math.floor((Date.now() - value.getTime()) / 1000);
  if (seconds < 60) return 'Baru saja';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(value);
}

export function readableDate(date) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return 'Tanggal tidak tersedia';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(value);
}

/** Render API-provided markup as safe plain text, never as raw HTML. */
export function plainText(html = '') {
  const doc = new DOMParser().parseFromString(String(html), 'text/html');
  return doc.body.textContent || '';
}

export function initials(value = '?') {
  return value.trim().split(/\s+/).slice(0, 2).map((word) => word[0]?.toUpperCase()).join('') || '?';
}

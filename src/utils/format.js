export const money = (n) => `₹${Number(n || 0).toFixed(2)}`;

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function prettyDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const initial = (name = '') => (name.trim()[0] || '?').toUpperCase();

export const ROLE_LABEL = {
  SCHOOL_ADMIN: 'School admin',
  TEACHER: 'Teacher',
  ACCOUNTANT: 'Accountant',
  STUDENT: 'Student',
  PARENT: 'Parent',
};

export const isValidPhone = (v) => /^\d{10}$/.test(v);

export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

// Adjust to whatever rule the backend enforces.
export const PASSWORD_MIN = 6;
export const isValidPassword = (v) => String(v || '').length >= PASSWORD_MIN;

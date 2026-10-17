// ─────────────────────────────────────────────────────────────────────────────
// The ONE place the app talks to the backend.
//  • Screens only ever call `api.<module>.<action>(args)`.
//  • While EXPO_PUBLIC_USE_MOCK is not "false", every call is answered from mockDb.js.
//  • When the backend is ready: set EXPO_PUBLIC_USE_MOCK=false, set EXPO_PUBLIC_API_URL,
//    and fix the paths/shapes below. Nothing else in the app has to change.
// ─────────────────────────────────────────────────────────────────────────────
import { db, uid } from './mockDb';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';
export const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK !== 'false';

let authToken = null;
export const setAuthToken = (token) => { authToken = token; };

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

async function request(method, path, { params, body } = {}) {
  const qs = params
    ? '?' + Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    : '';
  const res = await fetch(`${BASE_URL}${path}${qs}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch (e) { /* empty body */ }
  if (!res.ok) throw new ApiError((json && json.message) || `Request failed (${res.status})`, res.status);
  return json && json.data !== undefined ? json.data : json;
}

// endpoint(method, path, mockFn)  → async (args) => data
function endpoint(method, path, mock) {
  return async (args = {}) => {
    if (USE_MOCK) { await wait(); return mock(args); }
    const p = typeof path === 'function' ? path(args) : path;
    return request(method, p, method === 'GET' ? { params: args } : { body: args });
  };
}

// ── helpers used only by mocks ───────────────────────────────────────────────
const className = (id) => (db.classes.find((c) => c.id === id) || {}).name || '';
const feeFor = (classId, period) => (db.classFees.find((f) => f.classId === classId && f.period === period) || {}).amount || 0;
const paidFor = (studentId, period) => db.payments.filter((p) => p.studentId === studentId && (!period || p.period === period)).reduce((a, p) => a + p.amount, 0);
const match = (text, q) => !q || text.toLowerCase().includes(q.toLowerCase());

export const api = {
  // ── Auth ───────────────────────────────────────────────────────────────────
  auth: {
    requestOtp: endpoint('POST', '/auth/otp/request', ({ mobile }) => {
      if (!/^\d{10}$/.test(mobile)) throw new Error('Enter a valid 10 digit mobile number');
      return { sent: true };
    }),
    verifyOtp: endpoint('POST', '/auth/otp/verify', ({ mobile, otp }) => {
      if (otp !== '123456') throw new Error('That code is not correct. Demo code is 123456');
      return {
        token: 'mock-token',
        profiles: [
          { id: 'p1', name: 'Avinash', role: 'SCHOOL_ADMIN' },
          { id: 'p2', name: 'Avinash', role: 'STUDENT' },
          { id: 'p3', name: 'Sai', role: 'ACCOUNTANT' },
        ],
      };
    }),
  },

  // ── Students ───────────────────────────────────────────────────────────────
  students: {
    list: endpoint('GET', '/students', ({ q, classId }) =>
      db.students.filter((s) => (!classId || s.classId === classId) && match(`${s.name} ${s.phone || ''}`, q)).map((s) => ({ ...s, className: className(s.classId) }))
    ),
    create: endpoint('POST', '/students', ({ name, phone, language }) => {
      const s = { id: uid(), name, phone, language, classId: null };
      db.students.unshift(s);
      return s;
    }),
  },

  // ── Classes ────────────────────────────────────────────────────────────────
  classes: {
    list: endpoint('GET', '/classes', () => db.classes.slice()),
    create: endpoint('POST', '/classes', ({ name, teacherId }) => {
      const c = { id: uid(), name, teacher: teacherId ? `Teacher ${teacherId}` : null };
      db.classes.push(c);
      return c;
    }),
  },

  // ── Staff users ────────────────────────────────────────────────────────────
  staff: {
    list: endpoint('GET', '/staff', ({ q, role }) =>
      db.staff.filter((s) => (!role || s.roles.includes(role)) && match(`${s.name} ${s.phone}`, q))
    ),
    create: endpoint('POST', '/staff', ({ name, phone, role }) => {
      const s = { id: uid(), name, phone, roles: [role], active: true };
      db.staff.push(s);
      return s;
    }),
    setAccess: endpoint('PATCH', ({ id }) => `/staff/${id}/access`, ({ id, active }) => {
      const s = db.staff.find((x) => x.id === id);
      if (s) s.active = active;
      return s;
    }),
  },

  // ── Fees ───────────────────────────────────────────────────────────────────
  fees: {
    periods: endpoint('GET', '/fees/periods', () => db.periods.slice()),
    classFees: endpoint('GET', '/fees/class-fees', () => db.classFees.map((f) => ({ ...f, className: className(f.classId) }))),
    setClassFee: endpoint('PUT', '/fees/class-fees', ({ classId, period, amount }) => {
      if (!(Number(amount) > 0)) throw new Error('Enter the fee amount');
      const ex = db.classFees.find((f) => f.classId === classId && f.period === period);
      if (ex) ex.amount = Number(amount);
      else db.classFees.push({ classId, period, amount: Number(amount) });
      return { saved: true };
    }),
    roster: endpoint('GET', '/fees/roster', ({ classId, period }) =>
      db.students.filter((s) => s.classId === classId).map((s) => ({ studentId: s.id, name: s.name, assigned: feeFor(classId, period), paid: paidFor(s.id, period) }))
    ),
    collect: endpoint('POST', '/fees/payments', ({ studentId, period, amount, mode, note }) => {
      if (!(Number(amount) > 0)) throw new Error('Enter the amount received');
      const p = { id: uid(), studentId, period, amount: Number(amount), mode, note, date: new Date().toISOString().slice(0, 10) };
      db.payments.unshift(p);
      return p;
    }),
    payments: endpoint('GET', '/fees/payments', ({ studentId, period }) => db.payments.filter((p) => p.studentId === studentId && (!period || p.period === period))),
    ledger: endpoint('GET', ({ studentId }) => `/fees/students/${studentId}/ledger`, ({ studentId }) => {
      const s = db.students.find((x) => x.id === studentId);
      const items = db.periods
        .map((period) => ({ period, assigned: s ? feeFor(s.classId, period) : 0, paid: paidFor(studentId, period) }))
        .filter((i) => i.assigned > 0 || i.paid > 0);
      const assigned = items.reduce((a, i) => a + i.assigned, 0);
      const paid = items.reduce((a, i) => a + i.paid, 0);
      return { assigned, paid, due: assigned - paid, items };
    }),
    report: endpoint('GET', '/fees/report', ({ classId, period }) => {
      const list = db.students.filter((s) => !classId || s.classId === classId);
      const students = list.map((s) => ({ studentId: s.id, name: s.name, assigned: feeFor(s.classId, period), paid: paidFor(s.id, period) }));
      const total = students.reduce((a, s) => a + s.assigned, 0);
      const received = students.reduce((a, s) => a + s.paid, 0);
      return { total, received, pending: total - received, students };
    }),
  },

  // ── Student attendance ─────────────────────────────────────────────────────
  attendance: {
    roster: endpoint('GET', '/attendance/roster', ({ classId, date }) => {
      const saved = db.attendance.find((a) => a.classId === classId && a.date === date);
      return db.students.filter((s) => s.classId === classId).map((s) => ({ id: s.id, name: s.name, phone: s.phone, absent: saved ? saved.absentIds.includes(s.id) : false }));
    }),
    save: endpoint('POST', '/attendance', ({ classId, date, absentIds }) => {
      db.attendance = db.attendance.filter((a) => !(a.classId === classId && a.date === date));
      db.attendance.push({ classId, date, absentIds });
      return { saved: true };
    }),
    absent: endpoint('GET', '/attendance/absent', ({ classId, date }) => {
      const rec = db.attendance.find((a) => a.classId === classId && a.date === date);
      return rec ? db.students.filter((s) => rec.absentIds.includes(s.id)) : [];
    }),
    studentReport: endpoint('GET', '/attendance/student', ({ studentId, from, to }) =>
      db.attendance.filter((a) => a.date >= from && a.date <= to).map((a) => ({ date: a.date, status: a.absentIds.includes(studentId) ? 'ABSENT' : 'PRESENT' }))
        .sort((a, b) => (a.date < b.date ? 1 : -1))
    ),
    summary: endpoint('GET', '/attendance/summary', ({ classId, from, to }) => {
      const recs = db.attendance.filter((a) => a.classId === classId && a.date >= from && a.date <= to).sort((a, b) => (a.date < b.date ? 1 : -1));
      return {
        days: recs.length,
        absences: recs.reduce((n, r) => n + r.absentIds.length, 0),
        byDay: recs.map((r) => ({ date: r.date, students: db.students.filter((s) => r.absentIds.includes(s.id)) })),
      };
    }),
  },

  // ── Diary ──────────────────────────────────────────────────────────────────
  diary: {
    subjects: endpoint('GET', '/diary/subjects', () => db.subjects.slice()),
    list: endpoint('GET', '/diary', ({ classId, date }) => db.diary.filter((d) => d.classId === classId && d.date === date)),
    create: endpoint('POST', '/diary', ({ classId, date, subject, type, description }) => {
      if (!subject) throw new Error('Choose a subject');
      if (!description || !description.trim()) throw new Error('Write the description');
      const d = { id: uid(), classId, date, subject, type, description: description.trim() };
      db.diary.unshift(d);
      return d;
    }),
  },

  // ── Inventory ──────────────────────────────────────────────────────────────
  inventory: {
    items: endpoint('GET', '/inventory', ({ q }) => db.inventory.filter((i) => match(i.name, q))),
    create: endpoint('POST', '/inventory', ({ name, description, quantity, price }) => {
      const i = { id: uid(), name, description, quantity: Number(quantity) || 0, price: Number(price) || 0 };
      db.inventory.push(i);
      return i;
    }),
    adjust: endpoint('POST', ({ itemId }) => `/inventory/${itemId}/stock`, ({ itemId, type, quantity }) => {
      const item = db.inventory.find((i) => i.id === itemId);
      const q = Number(quantity);
      if (!(q > 0)) throw new Error('Enter a quantity');
      if (type === 'OUT' && q > item.quantity) throw new Error('Not enough stock');
      item.quantity += type === 'IN' ? q : -q;
      db.inventoryLogs.unshift({ id: uid(), itemId, type, quantity: q, date: new Date().toISOString().slice(0, 10) });
      return item;
    }),
    logs: endpoint('GET', '/inventory/logs', ({ itemId, type }) => db.inventoryLogs.filter((l) => l.itemId === itemId && (!type || l.type === type))),
  },

  // ── Circulars ──────────────────────────────────────────────────────────────
  circulars: {
    list: endpoint('GET', '/circulars', ({ q }) => db.circulars.filter((c) => match(c.title, q))),
    create: endpoint('POST', '/circulars', ({ title, content, date }) => {
      const c = { id: uid(), title, content, date };
      db.circulars.unshift(c);
      return c;
    }),
  },

  // ── Holiday SMS ────────────────────────────────────────────────────────────
  holiday: {
    recipientCount: endpoint('GET', '/holiday-sms/recipients', ({ classIds = [] }) => db.students.filter((s) => classIds.includes(s.classId) && s.phone).length),
    send: endpoint('POST', '/holiday-sms', ({ date, endDate, reason, classIds }) => {
      if (!reason || !reason.trim()) throw new Error('Write the reason for the holiday');
      if (!classIds.length) throw new Error('Choose at least one class');
      const m = { id: uid(), date, endDate, reason: reason.trim(), classCount: classIds.length };
      db.holidaySms.unshift(m);
      return m;
    }),
    history: endpoint('GET', '/holiday-sms', () => db.holidaySms.slice()),
  },
};

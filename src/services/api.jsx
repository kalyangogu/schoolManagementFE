// ─────────────────────────────────────────────────────────────────────────────
// The ONE place the app talks to the backend.
//  • Screens only ever call `api.<module>.<action>(args)`.
//  • While EXPO_PUBLIC_USE_MOCK is not "false", every call is answered from mockDb.js.
//  • When the backend is ready: set EXPO_PUBLIC_USE_MOCK=false, set EXPO_PUBLIC_API_URL,
//    and fix the paths/shapes below. Nothing else in the app has to change.
// ─────────────────────────────────────────────────────────────────────────────
import { db, uid } from './mockDb';
import { SECURITY_QUESTIONS } from '../config/securityQuestions';

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
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}${qs}`, {
    method,
    headers: { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch (e) { /* empty body */ }
  if (!res.ok) throw new ApiError((json && json.message) || `Request failed (${res.status})`, res.status);
  return json && json.data !== undefined ? json.data : json;
}

// endpoint(method, path, mockFn, toBody?)  → async (args) => data
// toBody(args) lets the request body use the backend's field names while screens keep clean ones.
function endpoint(method, path, mock, toBody) {
  return async (args = {}) => {
    if (USE_MOCK) { await wait(); return mock(args); }
    const p = typeof path === 'function' ? path(args) : path;
    return request(method, p, method === 'GET' ? { params: args } : { body: toBody ? toBody(args) : args });
  };
}

// ── helpers used only by mocks ───────────────────────────────────────────────
const className = (id) => (db.classes.find((c) => c.id === id) || {}).name || '';
const feeFor = (classId, period) => (db.classFees.find((f) => f.classId === classId && f.period === period) || {}).amount || 0;
const paidFor = (studentId, period) => db.payments.filter((p) => p.studentId === studentId && (!period || p.period === period)).reduce((a, p) => a + p.amount, 0);
const pad = (n) => String(n).padStart(2, '0');
const iso = () => new Date().toISOString().slice(0, 10);
const pct = (n, d) => (d ? Math.round((n / d) * 1000) / 10 : 0);

// Builds one month of staff attendance from seeded rules + any saved corrections.
function staffMonth({ teacherId, year, month }) {
  const total = new Date(year, month, 0).getDate();
  const today = iso();
  const days = [];
  for (let d = 1; d <= total; d++) {
    const date = `${year}-${pad(month)}-${pad(d)}`;
    const dow = new Date(year, month - 1, d).getDay();
    const fix = db.staffCorrections[`${teacherId}|${date}`];
    let status; let note = '';
    if (fix) { status = fix.status; note = fix.reason; }
    else if (dow === 0) { status = 'HOLIDAY'; note = 'Sunday'; }
    else if (db.holidays[date]) { status = 'HOLIDAY'; note = db.holidays[date]; }
    else if (date > today) { status = 'UPCOMING'; }
    else {
      const r = (d * 7 + teacherId) % 10;
      status = r === 0 ? 'ABSENT' : r === 1 ? 'LATE' : r === 2 ? 'HALF_DAY' : r === 3 ? 'LEAVE' : 'PRESENT';
      if (status === 'ABSENT') note = 'No attendance was recorded.';
      if (status === 'LEAVE') note = 'Casual leave';
    }
    const worked = status === 'PRESENT' || status === 'LATE' || status === 'HALF_DAY';
    days.push({
      date, status, note, corrected: !!fix,
      inTime: worked ? (status === 'LATE' ? '09:48 AM' : '09:02 AM') : null,
      outTime: worked ? (status === 'HALF_DAY' ? '01:05 PM' : '04:35 PM') : null,
    });
  }
  const count = (st) => days.filter((x) => x.status === st).length;
  const present = count('PRESENT'), absent = count('ABSENT'), late = count('LATE'), halfDay = count('HALF_DAY'), leave = count('LEAVE'), holidays = count('HOLIDAY');
  const workingDays = present + absent + late + halfDay + leave;
  return {
    summary: { present, absent, late, halfDay, leave, holidays, workingDays, calendarDays: total, percent: pct(present + late + halfDay * 0.5, workingDays) },
    days,
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// AUTH CONTRACT: the only part that has to match the backend's auth routes.
// Change the paths, request fields and response mapping here and nowhere else.
// ─────────────────────────────────────────────────────────────────────────────
const PATHS = {
  login: '/auth/login',
  sendOtp: '/auth/send-otp',
  verifyOtp: '/auth/verify-otp',
  forgotRequest: '/auth/forgot-password/request',      // staff + parent
  forgotReset: '/auth/forgot-password/reset',          // staff + parent
  studentSetQuestions: '/auth/student/security-questions',
  studentVerify: '/auth/student/forgot-password/verify',
  studentReset: '/auth/student/forgot-password/reset',
  adminReset: '/auth/admin/reset-password',            // needs the user.update permission
};

// Request bodies. The FIELD NAMES here are guesses: they live in auth.service on the backend.
const BODY = {
  login: ({ account, identifier, password }) => ({ identifier, password, userType: account }),
  sendOtp: ({ identifier }) => ({ identifier }),
  verifyOtp: ({ identifier, otp }) => ({ identifier, otp }),
  forgotRequest: ({ identifier }) => ({ identifier }),
  forgotReset: ({ identifier, code, newPassword }) => ({ identifier, otp: code, newPassword }),
  studentSetQuestions: ({ admissionNumber, answers }) => ({ admissionNumber, answers }),
  studentVerify: ({ admissionNumber, answers }) => ({ admissionNumber, answers }),
  studentReset: ({ admissionNumber, resetToken, newPassword }) => ({ admissionNumber, resetToken, newPassword }),
  adminReset: ({ userId, newPassword }) => ({ userId, newPassword }),
};

const RECOVERY_UNAVAILABLE = 'We could not start a reset for this account. If you never set security questions, please ask your school admin to reset your password.';
const ROLE_ALIASES = { ADMIN: 'SCHOOL_ADMIN', SCHOOLADMIN: 'SCHOOL_ADMIN', PRINCIPAL: 'SCHOOL_ADMIN' };
const normRole = (r) => { const k = String(r || '').toUpperCase().replace(/[\s-]+/g, '_'); return ROLE_ALIASES[k] || k; };
const normAnswer = (a) => String(a || '').trim().toLowerCase();

// Turns whatever the backend returns into { token, profiles: [{ id, name, role }] }.
export function normalizeSession(res) {
  const token = res && (res.token || res.accessToken || res.access_token);
  let profiles = res && res.profiles;
  if (!profiles && res && res.user) profiles = [{ id: res.user.id, name: res.user.name || res.user.fullName || 'User', role: res.user.role }];
  if (!token || !profiles || profiles.length === 0) throw new Error('Unexpected login response from the server');
  return { token, profiles: profiles.map((p) => ({ ...p, id: String(p.id), role: normRole(p.role) })) };
}

// ── mock-only helpers ───────────────────────────────────────────────────────
const idKey = (v) => String(v || '').trim().toLowerCase();
const findUser = (account, identifier) => db.users.find((u) => u.account === account && u.loginIds.includes(idKey(identifier)));
const findAnyUser = (identifier) => db.users.find((u) => u.loginIds.includes(idKey(identifier)));
const mockSession = (u) => { db.currentUserId = u.id; return { token: `mock-${u.id}`, profiles: u.profiles }; };
const checkPassword = (pw) => { if (String(pw || '').length < 6) throw new Error('Password must be at least 6 characters'); };

const loginCall = endpoint('POST', PATHS.login, ({ account, identifier, password }) => {
  if (!identifier || !identifier.trim() || !password) throw new Error('Enter your ID and password');
  const u = findUser(account, identifier);
  if (!u || u.password !== password) throw new Error('Invalid ID or password');
  return mockSession(u);
}, BODY.login);

const verifyOtpCall = endpoint('POST', PATHS.verifyOtp, ({ identifier, otp }) => {
  if (otp !== '123456') throw new Error('That code is not correct. Demo code is 123456');
  const u = findAnyUser(identifier);
  if (!u) throw new Error('No account found for that email or mobile number');
  return mockSession(u);
}, BODY.verifyOtp);

const match = (text, q) => !q || text.toLowerCase().includes(q.toLowerCase());

export const api = {
  // ── Auth ───────────────────────────────────────────────────────────────────
  auth: {
    // account = STUDENT | STAFF | PARENT. identifier = admission no. / email or user ID / email.
    login: async (args) => normalizeSession(await loginCall(args)),

    sendOtp: endpoint('POST', PATHS.sendOtp, ({ identifier }) => {
      if (!identifier || !identifier.trim()) throw new Error('Enter your email or mobile number');
      return { sent: true };
    }, BODY.sendOtp),
    verifyOtp: async (args) => normalizeSession(await verifyOtpCall(args)),

    // Forgot password: STAFF + PARENT → a code is sent, then they set a new password
    forgotRequest: endpoint('POST', PATHS.forgotRequest, ({ identifier }) => {
      if (!identifier || !identifier.trim()) throw new Error('Enter your email or user ID');
      return { sent: true }; // same answer whether or not the account exists
    }, BODY.forgotRequest),
    forgotReset: endpoint('POST', PATHS.forgotReset, ({ identifier, code, newPassword }) => {
      const u = findAnyUser(identifier);
      if (!u || u.account === 'STUDENT' || code !== '123456') throw new Error('That code is not correct or has expired');
      checkPassword(newPassword);
      u.password = newPassword;
      return { reset: true };
    }, BODY.forgotReset),

    // Students: security questions (set once while logged in, used to recover)
    studentSetSecurityQuestions: endpoint('POST', PATHS.studentSetQuestions, ({ admissionNumber, answers }) => {
      const u = findUser('STUDENT', admissionNumber);
      if (!u) throw new Error('Student not found');
      if (answers.length !== SECURITY_QUESTIONS.length || answers.some((a) => normAnswer(a.answer).length < 2)) throw new Error('Please answer every question');
      u.security = answers.map((a) => ({ questionId: a.questionId, answer: normAnswer(a.answer) }));
      return { saved: true };
    }, BODY.studentSetQuestions),
    studentVerifyAnswers: endpoint('POST', PATHS.studentVerify, ({ admissionNumber, answers }) => {
      const u = findUser('STUDENT', admissionNumber);
      if (!u || u.security.length === 0) throw new Error(RECOVERY_UNAVAILABLE);
      const ok = u.security.every((x) => { const g = answers.find((a) => a.questionId === x.questionId); return g && normAnswer(g.answer) === x.answer; });
      if (!ok) throw new Error('One or more answers are not correct');
      const token = `reset-${uid()}`;
      db.resetTokens[token] = u.id;
      return { resetToken: token };
    }, BODY.studentVerify),
    studentResetPassword: endpoint('POST', PATHS.studentReset, ({ admissionNumber, resetToken, newPassword }) => {
      const u = findUser('STUDENT', admissionNumber);
      if (!u || db.resetTokens[resetToken] !== u.id) throw new Error('This reset session has expired. Please start again.');
      checkPassword(newPassword);
      u.password = newPassword;
      delete db.resetTokens[resetToken];
      return { reset: true };
    }, BODY.studentReset),

    // School admin sets a new password for another user
    adminResetPassword: endpoint('POST', PATHS.adminReset, ({ userId, newPassword }) => {
      if (!userId) throw new Error('Choose a user');
      checkPassword(newPassword);
      return { reset: true };
    }, BODY.adminReset),
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

  // ── Staff attendance ───────────────────────────────────────────────────────
  staffAttendance: {
    month: endpoint('GET', '/staff-attendance', staffMonth),
    correct: endpoint('POST', '/staff-attendance/correction', ({ teacherId, date, status, reason }) => {
      if (!reason || !reason.trim()) throw new Error('Please write a reason for the correction');
      db.staffCorrections[`${teacherId}|${date}`] = { status, reason: reason.trim() };
      return { saved: true };
    }),
  },

  // ── Exams ──────────────────────────────────────────────────────────────────
  exams: {
    groups: endpoint('GET', '/exams/groups', () => db.examGroups.slice()),
    createGroup: endpoint('POST', '/exams/groups', ({ name }) => {
      if (!name || !name.trim()) throw new Error('Enter a group name');
      if (db.examGroups.some((g) => g.name.toLowerCase() === name.trim().toLowerCase())) throw new Error('That group already exists');
      const g = { id: uid(), name: name.trim() };
      db.examGroups.push(g);
      return g;
    }),
    subjects: endpoint('GET', '/exams/subjects', () => db.subjects.slice()),
    list: endpoint('GET', '/exams', ({ groupId, classId }) =>
      db.exams.filter((e) => e.groupId === groupId && e.classId === classId).sort((a, b) => (a.date < b.date ? -1 : 1))
    ),
    schedule: endpoint('POST', '/exams/schedule', ({ groupId, classId, items }) => {
      if (!items.length) throw new Error('Tick at least one subject');
      items.forEach((it) => {
        if (!(Number(it.maxMarks) > 0)) throw new Error(`Enter max marks for ${it.subject}`);
        const ex = db.exams.find((e) => e.groupId === groupId && e.classId === classId && e.subject === it.subject);
        if (ex) { ex.date = it.date; ex.maxMarks = Number(it.maxMarks); }
        else { const e = { id: uid(), groupId, classId, subject: it.subject, date: it.date, maxMarks: Number(it.maxMarks) }; db.exams.push(e); db.marks[e.id] = {}; }
      });
      return { count: items.length };
    }),
    roster: endpoint('GET', '/exams/roster', ({ examId }) => {
      const exam = db.exams.find((e) => e.id === examId);
      const m = db.marks[examId] || {};
      return {
        exam,
        students: db.students.filter((s) => s.classId === exam.classId).map((s) => ({ studentId: s.id, name: s.name, marks: m[s.id] === undefined ? null : m[s.id] })),
      };
    }),
    saveMarks: endpoint('POST', '/exams/marks', ({ examId, marks }) => {
      const exam = db.exams.find((e) => e.id === examId);
      marks.forEach((m) => {
        const v = Number(m.marks);
        if (Number.isNaN(v) || v < 0 || v > exam.maxMarks) throw new Error(`Marks must be between 0 and ${exam.maxMarks}`);
      });
      db.marks[examId] = db.marks[examId] || {};
      marks.forEach((m) => { db.marks[examId][m.studentId] = Number(m.marks); });
      return { saved: marks.length };
    }),
    performance: endpoint('GET', '/exams/performance', ({ groupId, classId }) => {
      const exams = db.exams.filter((e) => e.groupId === groupId && e.classId === classId);
      const students = db.students.filter((s) => s.classId === classId).map((s) => {
        let total = 0, max = 0;
        exams.forEach((e) => { const v = (db.marks[e.id] || {})[s.id]; if (v !== undefined) { total += v; max += e.maxMarks; } });
        return { studentId: s.id, name: s.name, total, max, percent: pct(total, max) };
      }).filter((s) => s.max > 0).sort((a, b) => b.percent - a.percent);
      const subjects = exams.map((e) => {
        const vals = Object.values(db.marks[e.id] || {});
        return { subject: e.subject, average: pct(vals.reduce((a, v) => a + v, 0), vals.length * e.maxMarks) };
      });
      return {
        exams: exams.length,
        students,
        subjects,
        average: students.length ? Math.round((students.reduce((a, s) => a + s.percent, 0) / students.length) * 10) / 10 : 0,
        highest: students.length ? students[0].percent : 0,
        passRate: pct(students.filter((s) => s.percent >= 35).length, students.length),
      };
    }),
  },

  // ── Events (gallery) ───────────────────────────────────────────────────────
  events: {
    list: endpoint('GET', '/events', () =>
      db.events.map((e) => ({ id: e.id, name: e.name, date: e.date, summary: e.summary, photoCount: e.photos.length })).sort((a, b) => (a.date < b.date ? 1 : -1))
    ),
    get: endpoint('GET', ({ id }) => `/events/${id}`, ({ id }) => db.events.find((e) => e.id === id)),
    // `photos` = array of local image URIs. With a real backend this is sent as multipart/form-data.
    create: async ({ name, date, summary, classIds, photos = [] }) => {
      if (USE_MOCK) {
        await wait();
        if (!name || !name.trim()) throw new Error('Enter the event name');
        const e = { id: uid(), name: name.trim(), date, summary: summary || '', classIds, photos };
        db.events.unshift(e);
        return e;
      }
      const fd = new FormData();
      fd.append('name', name);
      fd.append('date', date);
      fd.append('summary', summary || '');
      fd.append('classIds', JSON.stringify(classIds));
      photos.forEach((uri, i) => fd.append('photos', { uri, name: `photo-${i}.jpg`, type: 'image/jpeg' }));
      return request('POST', '/events', { body: fd });
    },
  },
};

// In-memory fake data so the whole app works before the backend is ready.
// Delete this file when you switch EXPO_PUBLIC_USE_MOCK=false.
let seq = 100;
export const uid = () => ++seq;

export const db = {
  classes: [
    { id: 1, name: 'Class 1', teacher: 'Teacher 1' },
    { id: 2, name: 'Class 1 A2', teacher: 'Teacher 3' },
    { id: 3, name: 'Class 10', teacher: null },
    { id: 4, name: 'Class 4', teacher: 'Teacher 4' },
    { id: 5, name: 'Class 5', teacher: 'Teacher 6' },
    { id: 6, name: 'LKG', teacher: 'Teacher 7' },
    { id: 7, name: 'Nursery', teacher: 'Teacher 8' },
    { id: 8, name: 'UKG', teacher: 'Teacher 6' },
  ],
  students: [
    { id: 23, name: 'Avinash', phone: '9183310079', classId: 1, language: 'English' },
    { id: 19, name: 'Prajeeth', phone: '9515140803', classId: 1, language: 'Telugu' },
    { id: 12, name: 'Sathvika', phone: '8897810373', classId: 1, language: 'English' },
    { id: 9, name: 'Sai', phone: '9989126909', classId: 2, language: 'Hindi' },
    { id: 8, name: 'Saketh', phone: '9642469290', classId: 3, language: 'English' },
    { id: 7, name: 'Ajay', phone: '8976543210', classId: 3, language: 'Telugu' },
    { id: 6, name: 'Ganesh', phone: '9876543210', classId: 3, language: 'English' },
    { id: 5, name: 'Nithya', phone: '1234567890', classId: 4, language: 'English' },
  ],
  staff: [
    { id: 1, name: 'Avinash', phone: '9183310079', roles: ['SCHOOL_ADMIN'], active: true },
    { id: 2, name: 'Sai', phone: '9989126909', roles: ['ACCOUNTANT'], active: true },
    { id: 3, name: 'Prajeeth', phone: '9515140896', roles: ['TEACHER'], active: false },
    { id: 4, name: 'Rukma Reddy Admin', phone: '9989126909', roles: ['SCHOOL_ADMIN', 'ACCOUNTANT'], active: true },
  ],
  periods: ['Term 1', 'Term 2', 'Term 3', 'Term 4'],
  classFees: [
    { classId: 1, period: 'Term 1', amount: 10000 },
    { classId: 1, period: 'Term 2', amount: 10000 },
    { classId: 1, period: 'Term 3', amount: 10000 },
    { classId: 4, period: 'Term 1', amount: 10000 },
  ],
  payments: [
    { id: 1, studentId: 19, period: 'Term 1', amount: 500, mode: 'CASH', date: '2026-06-14', note: '' },
    { id: 2, studentId: 19, period: 'Term 1', amount: 3000, mode: 'UPI', date: '2026-06-11', note: '' },
  ],
  attendance: [
    { classId: 3, date: '2026-06-22', absentIds: [23, 8] },
    { classId: 3, date: '2026-06-16', absentIds: [8] },
    { classId: 3, date: '2026-06-13', absentIds: [] },
  ],
  subjects: ['English', 'Hindi', 'Telugu', 'Maths', 'Science'],
  diary: [],
  inventory: [{ id: 1, name: 'Notebook', description: 'A4 ruled', quantity: 120, price: 25 }],
  inventoryLogs: [{ id: 1, itemId: 1, type: 'IN', quantity: 20, date: '2026-06-10' }],
  circulars: [
    { id: 1, title: 'Science fair', date: '2026-04-19', content: 'Science fair will be held in the school hall. Parents are welcome.' },
    { id: 2, title: 'Progress Card Signing', date: '2026-03-27', content: 'Please sign and return the progress card by Monday.' },
  ],
  holidaySms: [{ id: 1, date: '2026-06-01', reason: 'Rain', classCount: 8 }],
};

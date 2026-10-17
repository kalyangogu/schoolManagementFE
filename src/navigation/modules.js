// ─────────────────────────────────────────────────────────────────────────────
// Module registry. Add a feature in ONE place: it appears on Home, gets a route,
// and is shown only to the roles listed.
// ─────────────────────────────────────────────────────────────────────────────
import StudentsScreen from '../features/students/StudentsScreen';
import AddStudentScreen from '../features/students/AddStudentScreen';
import ClassesScreen from '../features/classes/ClassesScreen';
import AddClassScreen from '../features/classes/AddClassScreen';
import ClassDetailScreen from '../features/classes/ClassDetailScreen';
import StaffScreen from '../features/staff/StaffScreen';
import AddStaffScreen from '../features/staff/AddStaffScreen';
import FeesScreen from '../features/fees/FeesScreen';
import AttendanceScreen from '../features/attendance/AttendanceScreen';
import DiaryScreen from '../features/diary/DiaryScreen';
import InventoryScreen from '../features/inventory/InventoryScreen';
import CircularsScreen from '../features/circulars/CircularsScreen';
import HolidaySmsScreen from '../features/holiday/HolidaySmsScreen';
import ComingSoonScreen from '../features/common/ComingSoonScreen';

const ADMIN = 'SCHOOL_ADMIN';
const TEACHER = 'TEACHER';
const ACCOUNTANT = 'ACCOUNTANT';
const STUDENT = 'STUDENT';

// Tiles on the Home screen (in this order)
export const MODULES = [
  { key: 'Students', title: 'Students', icon: 'people-outline', component: StudentsScreen, roles: [ADMIN, TEACHER] },
  { key: 'Classes', title: 'Classes', icon: 'book-outline', component: ClassesScreen, roles: [ADMIN, TEACHER] },
  { key: 'Users', title: 'Users', icon: 'shield-checkmark-outline', component: StaffScreen, roles: [ADMIN] },
  { key: 'Fees', title: 'Fees', icon: 'cash-outline', component: FeesScreen, roles: [ADMIN, ACCOUNTANT] },
  { key: 'Attendance', title: 'Student attendance', icon: 'checkmark-done-outline', component: AttendanceScreen, roles: [ADMIN, TEACHER] },
  { key: 'StaffAttendance', title: 'Staff attendance', icon: 'id-card-outline', component: ComingSoonScreen, roles: [ADMIN] },
  { key: 'Diary', title: 'Diary', icon: 'journal-outline', component: DiaryScreen, roles: [ADMIN, TEACHER, STUDENT] },
  { key: 'Inventory', title: 'Inventory', icon: 'cube-outline', component: InventoryScreen, roles: [ADMIN, ACCOUNTANT] },
  { key: 'Exams', title: 'Exams', icon: 'school-outline', component: ComingSoonScreen, roles: [ADMIN, TEACHER, STUDENT] },
  { key: 'Circulars', title: 'Circulars', icon: 'megaphone-outline', component: CircularsScreen, roles: [ADMIN, TEACHER, ACCOUNTANT, STUDENT] },
  { key: 'Events', title: 'Events', icon: 'calendar-outline', component: ComingSoonScreen, roles: [ADMIN, TEACHER, STUDENT] },
  { key: 'HolidaySms', title: 'Holiday SMS', icon: 'chatbubble-ellipses-outline', component: HolidaySmsScreen, roles: [ADMIN] },
];

// Screens opened from inside a module (not shown as tiles)
export const EXTRA_SCREENS = [
  { name: 'AddStudent', component: AddStudentScreen },
  { name: 'AddClass', component: AddClassScreen },
  { name: 'ClassDetail', component: ClassDetailScreen },
  { name: 'AddStaff', component: AddStaffScreen },
];

export const modulesForRole = (role) => MODULES.filter((m) => m.roles.includes(role));

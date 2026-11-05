// The three kinds of login the backend supports. Labels/validation differ per type.
export const ACCOUNT_TYPES = [
  { key: 'STUDENT', label: 'Student', icon: 'account-school-outline', idLabel: 'Admission number', idPlaceholder: 'Example: ADM001', keyboard: 'default', email: false },
  { key: 'STAFF', label: 'Staff', icon: 'badge-account-outline', idLabel: 'Email or user ID', idPlaceholder: 'Email or staff user ID', keyboard: 'email-address', email: false },
  { key: 'PARENT', label: 'Parent', icon: 'account-supervisor-outline', idLabel: 'Email', idPlaceholder: 'Registered email address', keyboard: 'email-address', email: true },
];
export const accountType = (key) => ACCOUNT_TYPES.find((a) => a.key === key) || ACCOUNT_TYPES[0];

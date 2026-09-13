// Map between API role names and navigation screen names
export const ROLE_SCREEN_MAP = {
  Admin: "Admin",
  Teacher: "Teacher",
  Student: "Student",
  Receptionist: "Receptionist",
};

// Get the navigation screen for a given role (or null if unsupported)
export const getScreenForRole = (role) => ROLE_SCREEN_MAP[role] || null;

// Given the full list of roles, return only the ones that have a dashboard
export const getSelectableRoles = (roles = []) =>
  roles.filter((role) => ROLE_SCREEN_MAP[role]);

// Whether the user has multiple selectable dashboards to choose from
export const hasMultipleRoles = (roles = []) =>
  getSelectableRoles(roles).length > 1;


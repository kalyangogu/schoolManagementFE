// Register every school here. The active one is picked with EXPO_PUBLIC_SCHOOL.
// To add a school: copy greenvalley.json, edit it, and import it below.
import greenvalley from './greenvalley.json';
import sunrise from './sunrise.json';

export const SCHOOLS = { greenvalley, sunrise };

const requested = process.env.EXPO_PUBLIC_SCHOOL || 'sunrise';
export const activeSchool = SCHOOLS[requested] || sunrise;

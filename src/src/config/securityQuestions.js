// The backend accepts exactly these 6 keys (auth.service SECURITY_QUESTION_KEYS).
// A student picks 3 of them; only the chosen keys + hashed answers are stored.
// `text` / `hint` are what the app shows: change the wording freely, never change a `key`.
export const SECURITY_QUESTION_COUNT = 3;

export const SECURITY_QUESTIONS = [
  { key: 'dob', text: 'What is your date of birth?', hint: 'Example: 12-05-2012 (type it the same way every time)' },
  { key: 'favoriteTeacher', text: 'Who is your favourite teacher?', hint: 'Teacher name' },
  { key: 'favoriteFamilyMember', text: 'Who is your favourite family member?', hint: 'Name' },
  { key: 'firstPetName', text: "What was your first pet's name?", hint: 'Pet name' },
  { key: 'birthPlace', text: 'In which place were you born?', hint: 'Town or city' },
  { key: 'favoriteDestination', text: 'What is your favourite travel destination?', hint: 'Place' },
];

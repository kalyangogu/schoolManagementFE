// The routes show no endpoint to fetch a student's questions, so the app uses ONE fixed set that
// every student answers when setting up and again when recovering. If the backend stores/returns
// questions itself, change how these are loaded in features/auth (see README).
export const SECURITY_QUESTIONS = [
  { id: 'pet', text: "What was your first pet's name?" },
  { id: 'city', text: 'In which city were you born?' },
  { id: 'school', text: 'What was the name of your first school?' },
];

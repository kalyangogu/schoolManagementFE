import { baseColors, baseRadius, spacing, fontSize } from './tokens';

// Turns a school config (JSON) into the theme object used by every component.
export function createTheme(school) {
  const scale = school.cornerScale ?? 1;
  const radius = Object.fromEntries(
    Object.entries(baseRadius).map(([k, v]) => [k, k === 'pill' ? v : Math.round(v * scale)])
  );

  return {
    school,
    colors: { ...baseColors, ...(school.colors || {}) },
    spacing,
    fontSize,
    radius,
    shadow: {
      shadowColor: '#0B2A26',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
  };
}

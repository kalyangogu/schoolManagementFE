// Reads your existing app.json and overrides the per-school values.
// Build a school:  EXPO_PUBLIC_SCHOOL=sunrise npx expo start
const fs = require('fs');
const path = require('path');

const SCHOOLS = {
  greenvalley: require('./src/config/schools/greenvalley.json'),
  sunrise: require('./src/config/schools/sunrise.json'),
};

module.exports = ({ config }) => {
  const id = process.env.EXPO_PUBLIC_SCHOOL || 'greenvalley';
  const school = SCHOOLS[id] || SCHOOLS.greenvalley;

  // Optional per-school artwork: assets/schools/<id>/icon.png and splash.png
  const asset = (file) => {
    const rel = `./assets/schools/${school.id}/${file}`;
    return fs.existsSync(path.join(__dirname, rel)) ? rel : undefined;
  };
  const icon = asset('icon.png');
  const splash = asset('splash.png');

  return {
    ...config,
    name: school.appName,
    slug: school.slug,
    ...(icon ? { icon } : {}),
    splash: {
      ...(config.splash || {}),
      ...(splash ? { image: splash } : {}),
      backgroundColor: school.colors.primaryDark,
    },
    ios: { ...(config.ios || {}), bundleIdentifier: school.bundleId },
    android: {
      ...(config.android || {}),
      package: school.bundleId,
      adaptiveIcon: {
        ...((config.android && config.android.adaptiveIcon) || {}),
        backgroundColor: school.colors.primary,
      },
    },
    extra: { ...(config.extra || {}), school: school.id },
  };
};

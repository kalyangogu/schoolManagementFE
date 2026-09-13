import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";
const SELECTED_ROLE_KEY = "auth_selected_role";

export const saveTokens = async ({ accessToken, refreshToken }) => {
  if (accessToken) await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = async () =>
  await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = async () =>
  await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

export const saveUser = async (user) => {
  if (user) await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async () => {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const saveSelectedRole = async (role) => {
  if (role) await AsyncStorage.setItem(SELECTED_ROLE_KEY, role);
};

export const getSelectedRole = async () =>
  await AsyncStorage.getItem(SELECTED_ROLE_KEY);

export const clearAuth = async () => {
  await AsyncStorage.multiRemove([
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_KEY,
    SELECTED_ROLE_KEY,
  ]);
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_TTL } from "../config";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const ACCESS_TOKEN_EXPIRY_KEY = "auth_access_token_expiry";
const REFRESH_TOKEN_EXPIRY_KEY = "auth_refresh_token_expiry";
const USER_KEY = "auth_user";
const SELECTED_ROLE_KEY = "auth_selected_role";

const normalizeExpiry = (value, fallbackMs) => {
  if (!value) return Date.now() + fallbackMs;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return Date.now() + fallbackMs;
  return parsed;
};

export const saveTokens = async ({ accessToken, refreshToken, accessExpiresAt, refreshExpiresAt }) => {
  if (accessToken) await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  const finalAccessExpiry = normalizeExpiry(
    accessExpiresAt,
    TOKEN_TTL.ACCESS_TOKEN_MS,
  );
  const finalRefreshExpiry = normalizeExpiry(
    refreshExpiresAt,
    TOKEN_TTL.REFRESH_TOKEN_MS,
  );

  await AsyncStorage.setItem(ACCESS_TOKEN_EXPIRY_KEY, String(finalAccessExpiry));
  await AsyncStorage.setItem(REFRESH_TOKEN_EXPIRY_KEY, String(finalRefreshExpiry));
};

export const getAccessToken = async () =>
  await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = async () =>
  await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

export const getAccessTokenExpiry = async () => {
  const value = await AsyncStorage.getItem(ACCESS_TOKEN_EXPIRY_KEY);
  return value ? Number(value) : Date.now() + TOKEN_TTL.ACCESS_TOKEN_MS;
};

export const getRefreshTokenExpiry = async () => {
  const value = await AsyncStorage.getItem(REFRESH_TOKEN_EXPIRY_KEY);
  return value ? Number(value) : Date.now() + TOKEN_TTL.REFRESH_TOKEN_MS;
};

export const isAccessTokenExpired = async () => {
  const expiry = await getAccessTokenExpiry();
  return Date.now() >= expiry;
};

export const isRefreshTokenExpired = async () => {
  const expiry = await getRefreshTokenExpiry();
  return Date.now() >= expiry;
};

export const saveUser = async (user) => {
  if (user) await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async () => {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Failed to parse stored user, clearing auth state.", error);
    await clearAuth();
    return null;
  }
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
    ACCESS_TOKEN_EXPIRY_KEY,
    REFRESH_TOKEN_EXPIRY_KEY,
    USER_KEY,
    SELECTED_ROLE_KEY,
  ]);
};

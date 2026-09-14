import request, { ApiError } from "./apiClient";
import { ENDPOINTS, TOKEN_TTL } from "../config";
import {
  saveTokens,
  saveUser,
  clearAuth,
  getRefreshToken,
  getRefreshTokenExpiry,
} from "./tokenStorage";

// Send OTP to email or mobile
export const sendOtp = async (identifier) => {
  return await request(ENDPOINTS.AUTH_SEND_OTP, {
    method: "POST",
    body: { identifier },
    auth: false,
  });
};

// Verify OTP and get tokens
export const verifyOtp = async (identifier, otp) => {
  const data = await request(ENDPOINTS.AUTH_VERIFY_OTP, {
    method: "POST",
    body: { identifier, otp },
    auth: false,
  });

  const accessExpiresAt =
    data.accessExpiresAt ||
    data.expiresAt ||
    (Date.now() + TOKEN_TTL.ACCESS_TOKEN_MS);
  const refreshExpiresAt =
    data.refreshExpiresAt ||
    data.refreshExpiresIn ||
    (Date.now() + TOKEN_TTL.REFRESH_TOKEN_MS);

  await saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
  });
  await saveUser(data.user);

  return data;
};

// Manually refresh the access token
export const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new ApiError("No refresh token available. Please login again.", 401);
  }

  const refreshExpiry = await getRefreshTokenExpiry();
  if (Date.now() >= refreshExpiry) {
    throw new ApiError("Refresh token expired. Please login again.", 401);
  }

  const data = await request(ENDPOINTS.AUTH_REFRESH_TOKEN, {
    method: "POST",
    body: { refreshToken },
    auth: false,
  });

  const accessExpiresAt =
    data.accessExpiresAt ||
    data.expiresAt ||
    (Date.now() + TOKEN_TTL.ACCESS_TOKEN_MS);
  const refreshExpiresAt =
    data.refreshExpiresAt ||
    data.refreshExpiresIn ||
    refreshExpiry;

  await saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
  });
  return data.accessToken;
};

// Logout - clear local auth data
export const logout = async () => {
  await clearAuth();
};

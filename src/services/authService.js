import request, { ApiError } from "./apiClient";
import { ENDPOINTS } from "../config";
import {
  saveTokens,
  saveUser,
  clearAuth,
  getRefreshToken,
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

  // Persist tokens and user
  await saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
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
  const data = await request(ENDPOINTS.AUTH_REFRESH_TOKEN, {
    method: "POST",
    body: { refreshToken },
    auth: false,
  });
  await saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || refreshToken,
  });
  return data.accessToken;
};

// Logout - clear local auth data
export const logout = async () => {
  await clearAuth();
};

import { Platform } from "react-native";

// IMPORTANT:
// - On Android Emulator, your computer (host) is reached via 10.0.2.2
// - On iOS Simulator, localhost works
// - On a PHYSICAL DEVICE, replace HOST_IP with your computer's LAN IP
//   (e.g. 192.168.1.100). Find it with `ipconfig` on Windows.
const HOST_IP = "192.168.1.107"; // <-- change this for physical devices

const API_HOST = Platform.select({
  android: HOST_IP,
  ios: "localhost",
  default: "localhost",
});

export const API_BASE_URL = `http://${API_HOST}:5000/api`;

export const TOKEN_TTL = {
  ACCESS_TOKEN_MS: 15 * 60 * 1000,
  REFRESH_TOKEN_MS: 7 * 24 * 60 * 60 * 1000,
};

export const SESSION_REFRESH_MARGIN_MS = 3 * 60 * 1000;
export const SESSION_CHECK_INTERVAL_MS = 30 * 1000;

export const ENDPOINTS = {
  AUTH_SEND_OTP: "/auth/send-otp",
  AUTH_VERIFY_OTP: "/auth/verify-otp",
  AUTH_REFRESH_TOKEN: "/auth/refresh-token",
};

import { Platform } from "react-native";

// IMPORTANT:
// - On Android Emulator, your computer (host) is reached via 10.0.2.2
// - On iOS Simulator, localhost works
// - On a PHYSICAL DEVICE, replace HOST_IP with your computer's LAN IP
//   (e.g. 192.168.1.100). Find it with `ipconfig` on Windows.
const HOST_IP = "192.168.1.108"; // <-- change this for physical devices

const API_HOST = Platform.select({
  android: HOST_IP,
  ios: "localhost",
  default: "localhost",
});

export const API_BASE_URL = `http://${API_HOST}:5000/api`;

export const ENDPOINTS = {
  AUTH_SEND_OTP: "/auth/send-otp",
  AUTH_VERIFY_OTP: "/auth/verify-otp",
  AUTH_REFRESH_TOKEN: "/auth/refresh-token",
};

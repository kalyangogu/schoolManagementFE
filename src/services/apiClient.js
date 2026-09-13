import { API_BASE_URL, ENDPOINTS } from "../config";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearAuth,
} from "./tokenStorage";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let pendingRequests = [];

const notifyPending = (error = null) => {
  pendingRequests.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve()
  );
  pendingRequests = [];
};

const tryRefreshToken = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new ApiError("Session expired. Please login again.", 401);

  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_REFRESH_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new ApiError("Refresh token invalid. Please login again.", response.status);
  }

  const data = await response.json();
  await saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || refreshToken,
  });
  return data.accessToken;
};

const request = async (path, { method = "GET", body, headers = {}, auth = true } = {}) => {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  let finalHeaders = { "Content-Type": "application/json", ...headers };

  if (auth) {
    const accessToken = await getAccessToken();
    if (accessToken) finalHeaders.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle token expiry by refreshing once
  if (response.status === 401 && auth) {
    try {
      if (isRefreshing) {
        // Wait for the in-progress refresh, then retry
        await new Promise((resolve, reject) =>
          pendingRequests.push({ resolve, reject })
        );
      } else {
        isRefreshing = true;
        try {
          await tryRefreshToken();
          notifyPending();
        } catch (refreshError) {
          notifyPending(refreshError);
          await clearAuth();
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      // Retry the original request with the new token
      const newAccessToken = await getAccessToken();
      response = await fetch(url, {
        method,
        headers: { ...finalHeaders, Authorization: `Bearer ${newAccessToken}` },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      throw error;
    }
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return data;
};

export default request;
export { ApiError };

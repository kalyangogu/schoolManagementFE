import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getUser,
  getAccessToken,
  getSelectedRole,
  saveSelectedRole,
  clearAuth,
  isAccessTokenExpired,
  isRefreshTokenExpired,
  getAccessTokenExpiry,
} from "../services/tokenStorage";
import {
  logout as logoutService,
  refreshAccessToken,
} from "../services/authService";
import {
  SESSION_CHECK_INTERVAL_MS,
  SESSION_REFRESH_MARGIN_MS,
} from "../config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRoleState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAuth = async () => {
      try {
        const [storedUser, accessToken, storedRole] = await Promise.all([
          getUser(),
          getAccessToken(),
          getSelectedRole(),
        ]);

        const hasValidUser = storedUser && typeof storedUser === "object" && accessToken;
        const accessExpired = accessToken ? await isAccessTokenExpired() : true;
        const refreshExpired = accessToken ? await isRefreshTokenExpired() : true;

        if (!hasValidUser || accessExpired && refreshExpired) {
          await clearAuth();
          if (isMounted) {
            setUser(null);
            setRoles([]);
            setSelectedRoleState(null);
            setIsAuthenticated(false);
          }
          return;
        }

        const normalizedRoles = Array.isArray(storedUser.roles) ? storedUser.roles : [];

        if (isMounted) {
          setUser(storedUser);
          setRoles(normalizedRoles);
          setSelectedRoleState(storedRole || null);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("Error loading auth state", error);
        if (isMounted) {
          await clearAuth();
          setUser(null);
          setRoles([]);
          setSelectedRoleState(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsAuthenticating(false);
        }
      }
    };

    loadAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let isCancelled = false;

    const refreshSessionIfNeeded = async () => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) return;

        const expiryTime = await getAccessTokenExpiry();
        const timeRemainingMs = expiryTime - Date.now();

        if (timeRemainingMs <= SESSION_REFRESH_MARGIN_MS) {
          await refreshAccessToken();
        }
      } catch (error) {
        console.log("Background token refresh failed", error);
        if (isCancelled) return;
        await clearAuth();
        setUser(null);
        setRoles([]);
        setSelectedRoleState(null);
        setIsAuthenticated(false);
      }
    };

    refreshSessionIfNeeded();
    const timerId = setInterval(refreshSessionIfNeeded, SESSION_CHECK_INTERVAL_MS);

    return () => {
      isCancelled = true;
      clearInterval(timerId);
    };
  }, [isAuthenticated]);

  const login = useCallback((userData, userRoles) => {
    const normalizedRoles = Array.isArray(userRoles)
      ? userRoles
      : Array.isArray(userData?.roles)
        ? userData.roles
        : [];

    setUser(userData);
    setRoles(normalizedRoles);
    setSelectedRoleState(null);
    setIsAuthenticated(true);
  }, []);

  const setSelectedRole = useCallback(async (role) => {
    setSelectedRoleState(role);
    await saveSelectedRole(role);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } catch (error) {
      console.log("Error during logout", error);
    } finally {
      await clearAuth();
      setUser(null);
      setRoles([]);
      setSelectedRoleState(null);
      setIsAuthenticated(false);
    }
  }, []);

  const value = {
    user,
    roles,
    selectedRole,
    isAuthenticated,
    isAuthenticating,
    login,
    setSelectedRole,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

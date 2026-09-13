import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getUser,
  getAccessToken,
  getSelectedRole,
  saveSelectedRole,
  clearAuth,
} from "../services/tokenStorage";
import { logout as logoutService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRoleState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const [storedUser, accessToken, storedRole] = await Promise.all([
          getUser(),
          getAccessToken(),
          getSelectedRole(),
        ]);
        if (storedUser && accessToken) {
          setUser(storedUser);
          setRoles(storedUser.roles || []);
          setSelectedRoleState(storedRole || null);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("Error loading auth state", error);
      } finally {
        setIsAuthenticating(false);
      }
    };
    loadAuth();
  }, []);

  const login = useCallback((userData, userRoles) => {
    setUser(userData);
    setRoles(userRoles || userData?.roles || []);
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

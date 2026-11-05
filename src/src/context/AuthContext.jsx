import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken, setUnauthorizedHandler } from '../services/api';
import { useToast } from '../components/ui';

const KEY = '@school/session';
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null); // { token, profiles, activeId }
  const [ready, setReady] = useState(false);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const s = JSON.parse(raw);
          setAuthToken(s.token);
          setSession(s);
        }
      } catch (e) { /* start logged out */ }
      setReady(true);
    })();
  }, []);

  const persist = useCallback(async (s) => {
    setSession(s);
    setAuthToken(s ? s.token : null);
    try {
      if (s) await AsyncStorage.setItem(KEY, JSON.stringify(s));
      else await AsyncStorage.removeItem(KEY);
    } catch (e) { /* ignore storage errors */ }
  }, []);

  // Everything below ends in a saved session; the navigator then moves to Home by itself.
  const startSession = useCallback((res, fallbackLoginId) => persist({ token: res.token, refreshToken: res.refreshToken, profiles: res.profiles, activeId: res.profiles[0].id, loginId: res.loginId || fallbackLoginId }), [persist]);

  const login = useCallback(async ({ account, identifier, password }) => startSession(await api.auth.login({ account, identifier: identifier.trim(), password }), identifier.trim()), [startSession]);
  const requestOtp = useCallback((identifier) => api.auth.sendOtp({ identifier }), []);
  const verifyOtp = useCallback(async (identifier, otp) => startSession(await api.auth.verifyOtp({ identifier, otp }), identifier), [startSession]);

  // If the server rejects our token (it expired), go back to the login screen.
  useEffect(() => {
    setUnauthorizedHandler(() => { persist(null); toast.error('Your session expired. Please log in again.'); });
    return () => setUnauthorizedHandler(null);
  }, [persist, toast]);

  const switchProfile = useCallback((id) => persist({ ...session, activeId: id }), [persist, session]);
  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(() => {
    const profiles = session ? session.profiles : [];
    return {
      ready,
      isLoggedIn: !!session,
      loginId: session ? session.loginId : null,
      profiles,
      activeProfile: profiles.find((p) => p.id === (session && session.activeId)) || null,
      login, requestOtp, verifyOtp, switchProfile, logout,
    };
  }, [ready, session, login, requestOtp, verifyOtp, switchProfile, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

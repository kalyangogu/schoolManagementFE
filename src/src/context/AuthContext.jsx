import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../services/api';

const KEY = '@school/session';
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null); // { token, profiles, activeId }
  const [ready, setReady] = useState(false);

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

  const requestOtp = useCallback((mobile) => api.auth.requestOtp({ mobile }), []);

  const verifyOtp = useCallback(async (mobile, otp) => {
    const res = await api.auth.verifyOtp({ mobile, otp });
    await persist({ token: res.token, profiles: res.profiles, activeId: res.profiles[0].id });
  }, [persist]);

  const switchProfile = useCallback((id) => persist({ ...session, activeId: id }), [persist, session]);
  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(() => {
    const profiles = session ? session.profiles : [];
    return {
      ready,
      isLoggedIn: !!session,
      profiles,
      activeProfile: profiles.find((p) => p.id === (session && session.activeId)) || null,
      requestOtp, verifyOtp, switchProfile, logout,
    };
  }, [ready, session, requestOtp, verifyOtp, switchProfile, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

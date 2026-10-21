import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { useTheme } from '../../theme';

const ToastContext = createContext({ success() {}, error() {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  const show = useCallback((type, message) => {
    clearTimeout(timer.current);
    setToast({ type, message });
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    timer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setToast(null));
    }, 2600);
  }, [opacity]);

  const api = useMemo(() => ({ success: (m) => show('success', m), error: (m) => show('error', m) }), [show]);
  const ok = toast?.type === 'success';

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? (
        <Animated.View pointerEvents="none" style={[styles.wrap, { opacity, bottom: insets.bottom + 24 }]}>
          <View style={[styles.box, { backgroundColor: ok ? t.colors.primaryDark : t.colors.danger }]}>
            <Icon name={ok ? 'checkmark-circle' : 'alert-circle'} size={20} color="#fff" />
            <Text style={styles.text}>{toast.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, maxWidth: '100%' },
  text: { color: '#fff', fontWeight: '600', fontSize: 14, flexShrink: 1 },
});

import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { Animated, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import { colors } from "../styles/colors";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef(null);

  const showToast = useCallback(
    (message, type = "success", duration = 3000) => {
      // Clear any existing timer
      if (hideTimer.current) clearTimeout(hideTimer.current);

      setToast({ message, type });

      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      hideTimer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => setToast(null));
      }, duration);
    },
    [opacity]
  );

  const showSuccess = useCallback(
    (message, duration) => showToast(message, "success", duration),
    [showToast]
  );

  const showError = useCallback(
    (message, duration) => showToast(message, "error", duration),
    [showToast]
  );

  const value = { showToast, showSuccess, showError };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toastContainer,
            { opacity },
            toast.type === "error" ? styles.errorBg : styles.successBg,
          ]}
        >
          <View style={styles.toastContent}>
            <AppText variant="bodyMedium" color={colors.white} style={styles.toastText}>
              {toast.message}
            </AppText>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  successBg: {
    backgroundColor: colors.success,
  },
  errorBg: {
    backgroundColor: colors.error,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  toastText: {
    flex: 1,
    textAlign: "center",
  },
});

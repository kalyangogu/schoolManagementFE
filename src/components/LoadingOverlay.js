import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AppText from "./AppText";
import { colors } from "../styles/colors";

export default function LoadingOverlay({ visible = false, message = "Loading..." }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors.primary} />
        {message ? (
          <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.message}>
            {message}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    minWidth: 150,
  },
  message: {
    marginTop: 12,
    textAlign: "center",
  },
});

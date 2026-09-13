import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import AppText from "./AppText";
import { colors } from "../styles/colors";

export default function AppTextInput({
  label,
  error,
  leftIcon,
  style,
  inputStyle,
  ...props
}) {
  return (
    <View style={[styles.container, style]}>
      {label ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, inputStyle]}
          {...props}
        />
      </View>
      {error ? (
        <AppText variant="caption" color={colors.error} style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.textPrimary,
  },
  error: {
    marginTop: 4,
  },
});

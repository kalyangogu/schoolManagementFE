import React from "react";
import { TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import AppText from "./AppText";
import { colors } from "../styles/colors";

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  color = colors.primary,
  textColor = colors.textOnPrimary,
  style,
  textStyle,
}) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: color },
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText
          variant="button"
          color={textColor}
          style={[styles.text, textStyle]}
        >
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    textAlign: "center",
  },
});

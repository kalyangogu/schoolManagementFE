import React from "react";
import { Text } from "react-native";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";

export default function AppText({
  children,
  variant = "body",
  color = colors.textPrimary,
  style,
  numberOfLines,
  ...props
}) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[typography[variant] || typography.body, { color }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ActionButton({ label, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 8,
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },
  text: { fontSize: 14, fontWeight: "600" }
});

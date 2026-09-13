import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SummaryCard({ title, count, color }) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: 8, padding: 20, borderRadius: 12 },
  title: { fontSize: 16, fontWeight: "600" },
  count: { fontSize: 20, fontWeight: "bold", marginTop: 5 }
});

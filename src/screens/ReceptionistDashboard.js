import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import AppText from "../components/AppText";
import { colors } from "../styles/colors";

export default function ReceptionistDashboard() {
  return (
    <View style={styles.container}>
      <Header title="Receptionist Dashboard" subtitle="Visitors and appointments" />
      <View style={styles.content}>
        <AppText style={styles.text}>Receptionist Dashboard</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});

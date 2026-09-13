import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import AppText from "../components/AppText";
import { colors } from "../styles/colors";

export default function TeacherDashboard() {
  return (
    <View style={styles.container}>
      <Header title="Teacher Dashboard" subtitle="Your classes and students" />
      <View style={styles.content}>
        <AppText style={styles.text}>Teacher Dashboard</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});

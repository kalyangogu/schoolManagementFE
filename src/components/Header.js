import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";
import { useAuth } from "../state/store";
import { colors } from "../styles/colors";

// Reusable header with a logout button for dashboard screens
export default function Header({ title, subtitle }) {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    // AppNavigator conditionally renders the Login screen when
    // isAuthenticated becomes false — no manual navigation needed.
  };

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <AppText variant="title" color={colors.textOnPrimary}>{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.textOnPrimary}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.actions}>
        {user?.name ? (
          <AppText variant="caption" color={colors.textOnPrimary} style={styles.userName}>
            Hi, {user.name}
          </AppText>
        ) : null}
        <Ionicons
          name="log-out-outline"
          size={24}
          color={colors.textOnPrimary}
          onPress={handleLogout}
          style={styles.logoutIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  titleContainer: { flex: 1 },
  actions: { flexDirection: "row", alignItems: "center" },
  userName: { marginRight: 12 },
  logoutIcon: { padding: 4 },
});

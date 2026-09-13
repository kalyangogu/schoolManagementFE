import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { useAuth } from "../state/store";
import { getSelectableRoles, getScreenForRole } from "../utils/roles";
import { colors } from "../styles/colors";

const ROLE_ICONS = {
  Admin: "shield-checkmark-outline",
  Teacher: "school-outline",
  Student: "person-outline",
  Receptionist: "call-outline",
};

export default function RoleSelectionScreen({ navigation }) {
  const { user, roles, setSelectedRole, logout } = useAuth();
  const selectableRoles = getSelectableRoles(roles);

  // Auto-redirect when there's only one role — must be in useEffect to avoid
  // updating AuthProvider state during render
  useEffect(() => {
    if (selectableRoles.length === 1) {
      const role = selectableRoles[0];
      setSelectedRole(role);
      const screen = getScreenForRole(role);
      if (screen) navigation.replace(screen);
    }
  }, [selectableRoles, setSelectedRole, navigation]);

  const handleSelect = async (role) => {
    await setSelectedRole(role);
    const screen = getScreenForRole(role);
    if (screen) navigation.replace(screen);
  };

  if (selectableRoles.length === 1) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <AppText variant="heading" style={styles.title}>Select Role</AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Hi {user?.name || "there"}, please choose a role.
        </AppText>
        {selectableRoles.map((role) => (
          <TouchableOpacity key={role} style={styles.roleItem} onPress={() => handleSelect(role)}>
            <Ionicons name={ROLE_ICONS[role] || "briefcase-outline"} size={24} color={colors.primary} />
            <AppText variant="bodyMedium" style={styles.roleText}>Continue as {role}</AppText>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
        <AppButton title="Logout" color={colors.error} onPress={logout} style={styles.logoutButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 24 },
  title: { textAlign: "center", marginBottom: 8 },
  subtitle: { textAlign: "center", marginBottom: 20 },
  roleItem: { flexDirection: "row", alignItems: "center", padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginBottom: 12 },
  roleText: { flex: 1, marginLeft: 12 },
  logoutButton: { marginTop: 8 },
});

import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";

const SUMMARY_DATA = [
  {
    title: "Students",
    value: "850",
    icon: "people-outline",
    iconColor: "#4361EE",
  },
  {
    title: "Teachers",
    value: "45",
    icon: "school-outline",
    iconColor: "#7C3AED",
  },
  {
    title: "Classes",
    value: "30",
    icon: "business-outline",
    iconColor: "#059669",
  },
  {
    title: "Staff",
    value: "18",
    icon: "briefcase-outline",
    iconColor: "#EA580C",
  },
];

const QUICK_ACTIONS = [
  {
    title: "Add Student",
    icon: "person-add-outline",
    color: "#4361EE",
  },
  {
    title: "Add Staff",
    icon: "people-outline",
    color: "#7C3AED",
  },
  {
    title: "Create Class",
    icon: "add-circle-outline",
    color: "#059669",
  },
  {
    title: "Collect Fee",
    icon: "cash-outline",
    color: "#EA580C",
  },
];

const MODULES = [
  {
    title: "Students",
    description: "Manage student records",
    icon: "people-outline",
    color: "#4361EE",
  },
  {
    title: "Classes",
    description: "Manage classes and teachers",
    icon: "school-outline",
    color: "#7C3AED",
  },
  {
    title: "Users & Staff",
    description: "Manage school users",
    icon: "person-circle-outline",
    color: "#0891B2",
  },
  {
    title: "Fees",
    description: "Payments and fee records",
    icon: "wallet-outline",
    color: "#059669",
  },
  {
    title: "Attendance",
    description: "Student and staff attendance",
    icon: "checkmark-circle-outline",
    color: "#CA8A04",
  },
  {
    title: "Diary",
    description: "Manage school diary",
    icon: "book-outline",
    color: "#DB2777",
  },
  {
    title: "Inventory",
    description: "Manage school stock",
    icon: "cube-outline",
    color: "#EA580C",
  },
  {
    title: "Exams",
    description: "Exams and marks",
    icon: "document-text-outline",
    color: "#2563EB",
  },
  {
    title: "Circulars",
    description: "School announcements",
    icon: "megaphone-outline",
    color: "#9333EA",
  },
  {
    title: "Events",
    description: "Manage school events",
    icon: "calendar-outline",
    color: "#0D9488",
  },
  {
    title: "Holiday SMS",
    description: "Send holiday messages",
    icon: "chatbubble-outline",
    color: "#DC2626",
  },
];

export default function AdminDashboard() {
  const handleQuickAction = (action) => {
    Alert.alert(action, `${action} screen will be connected next.`);
  };

  const handleModulePress = (module) => {
    Alert.alert(module.title, `${module.title} module will be connected next.`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Admin Dashboard"
        subtitle="School Management"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Good morning 👋</Text>

          <Text style={styles.welcomeSubtitle}>
            Here's what's happening in your school today.
          </Text>
        </View>

        {/* Summary Cards */}
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.summaryGrid}>
          {SUMMARY_DATA.map((item) => (
            <View style={styles.summaryCard} key={item.title}>
              <View
                style={[
                  styles.summaryIconContainer,
                  { backgroundColor: `${item.iconColor}15` },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={item.iconColor}
                />
              </View>

              <Text style={styles.summaryValue}>{item.value}</Text>

              <Text style={styles.summaryTitle}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickActionsContainer}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.title}
              style={styles.quickAction}
              activeOpacity={0.75}
              onPress={() => handleQuickAction(action.title)}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: `${action.color}15` },
                ]}
              >
                <Ionicons
                  name={action.icon}
                  size={22}
                  color={action.color}
                />
              </View>

              <Text style={styles.quickActionText}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Management Modules */}
        <View style={styles.moduleHeader}>
          <Text style={styles.sectionTitle}>School Management</Text>

          <Text style={styles.moduleCount}>
            {MODULES.length} modules
          </Text>
        </View>

        <View style={styles.moduleGrid}>
          {MODULES.map((module) => (
            <TouchableOpacity
              key={module.title}
              style={styles.moduleCard}
              activeOpacity={0.75}
              onPress={() => handleModulePress(module)}
            >
              <View
                style={[
                  styles.moduleIcon,
                  { backgroundColor: `${module.color}15` },
                ]}
              >
                <Ionicons
                  name={module.icon}
                  size={25}
                  color={module.color}
                />
              </View>

              <View style={styles.moduleTextContainer}>
                <Text style={styles.moduleTitle}>
                  {module.title}
                </Text>

                <Text style={styles.moduleDescription}>
                  {module.description}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    padding: 20,
  },

  welcomeSection: {
    marginBottom: 24,
  },

  welcomeTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  summaryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 2,
  },

  summaryIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  summaryValue: {
    fontSize: 25,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 3,
  },

  summaryTitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  quickAction: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,

    elevation: 1,
  },

  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  quickActionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  moduleCount: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 14,
  },

  moduleGrid: {
    marginBottom: 10,
  },

  moduleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,

    elevation: 1,
  },

  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  moduleTextContainer: {
    flex: 1,
  },

  moduleTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 3,
  },

  moduleDescription: {
    fontSize: 12,
    color: "#6B7280",
  },

  bottomSpacing: {
    height: 30,
  },
});

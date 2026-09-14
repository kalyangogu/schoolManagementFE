import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import AdminDashboard from "../screens/AdminDashboard";
import TeacherDashboard from "../screens/TeacherDashboard";
import StudentDashboard from "../screens/StudentDashboard";
import ReceptionistDashboard from "../screens/ReceptionistDashboard";
import { ToastProvider } from "../components/Toast";
import { AuthProvider, useAuth } from "../state/store";
import { colors } from "../styles/colors";
import { getScreenForRole } from "../utils/roles";

const Stack = createStackNavigator();

function AppStack() {
  const { isAuthenticated, isAuthenticating, selectedRole } = useAuth();

  if (isAuthenticating) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const initialRouteName = !isAuthenticated
    ? "Login"
    : selectedRole && getScreenForRole(selectedRole)
      ? getScreenForRole(selectedRole)
      : "RoleSelection";

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Admin" component={AdminDashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Teacher" component={TeacherDashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Student" component={StudentDashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Receptionist" component={ReceptionistDashboard} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </ToastProvider>
    </AuthProvider>
  );
}

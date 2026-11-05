import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme';
import LoginScreen from '../features/auth/LoginScreen';
import ForgotPasswordScreen from '../features/auth/ForgotPasswordScreen';
import HomeScreen from '../features/home/HomeScreen';
import { MODULES, EXTRA_SCREENS } from './modules';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const t = useTheme();
  const { ready, isLoggedIn } = useAuth();

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.primaryDark }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  const navTheme = {
    dark: false,
    colors: { primary: t.colors.primary, background: t.colors.background, card: t.colors.surface, text: t.colors.text, border: t.colors.border, notification: t.colors.primary },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' }, medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' }, heavy: { fontFamily: 'System', fontWeight: '800' },
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            {MODULES.map((m) => <Stack.Screen key={m.key} name={m.key} component={m.component} />)}
            {EXTRA_SCREENS.map((s) => <Stack.Screen key={s.name} name={s.name} component={s.component} />)}
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types';
import { useAuthStore } from './src/store/authStore';
import { useTheme } from './src/hooks/useTheme';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ImageDetailsScreen from './src/screens/ImageDetailsScreen';
import MainTabs from './src/navigation/MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { colors, mode } = useTheme();

  const navTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar style={colors.statusBar} />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerTitleStyle: { fontWeight: '700' } }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen
                name="ImageDetails"
                component={ImageDetailsScreen}
                options={{ title: 'Image Details' }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

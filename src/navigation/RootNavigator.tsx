import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import CustomerDrawer from './CustomerDrawer';
import AdminDrawer from './AdminDrawer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
  const { user, isReady: authReady } = useAuth();
  const { colors, isReady: themeReady } = useTheme();

  if (!authReady || !themeReady) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.role === 'admin' ? (
          <Stack.Screen name="AdminRoot" component={AdminDrawer} />
        ) : (
          <Stack.Screen name="CustomerRoot" component={CustomerDrawer} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default RootNavigator;

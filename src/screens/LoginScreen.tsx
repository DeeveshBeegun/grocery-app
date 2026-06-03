import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import LogoPlaceholder from '../components/LogoPlaceholder';
import Button from '../components/Button';

const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>('customer');

  const RoleCard = ({ value, title, subtitle, icon }: { value: UserRole; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }) => {
    const active = role === value;
    return (
      <Pressable onPress={() => setRole(value)} style={[styles.roleCard, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primarySoft : colors.card }]}>
        <View style={[styles.roleIcon, { backgroundColor: active ? colors.primary : colors.surface }]}>
          <Ionicons name={icon} size={24} color={active ? colors.onPrimary : colors.textMuted} />
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={[styles.roleTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.roleSub, { color: colors.textMuted }]}>{subtitle}</Text>
        </View>
        <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={22} color={active ? colors.primary : colors.border} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <LogoPlaceholder size="lg" />
          <Text style={[styles.welcome, { color: colors.text }]}>Fresh groceries,{'\n'}delivered to your door</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>Sign in to start shopping for fresh vegetables and fruits.</Text>
        </View>

        <Text style={[styles.section, { color: colors.text }]}>Continue as</Text>
        <RoleCard value="customer" title="Customer" subtitle="Browse, order and track deliveries" icon="person" />
        <RoleCard value="admin" title="Admin" subtitle="Manage products, orders & packages" icon="shield-checkmark" />

        <Button
          title={role === 'admin' ? 'Login as Admin' : 'Login as Customer'}
          icon="log-in-outline"
          onPress={() => login(role)}
          style={{ marginTop: 22 }}
          size="lg"
        />
        <Text style={[styles.note, { color: colors.textMuted }]}>Mock authentication · no password required</Text>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: 36 },
  welcome: { fontSize: 26, fontWeight: '900', textAlign: 'center', marginTop: 22, lineHeight: 32 },
  sub: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20, paddingHorizontal: 10 },
  section: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  roleCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 16, padding: 16, marginBottom: 12 },
  roleIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  roleTitle: { fontSize: 16, fontWeight: '800' },
  roleSub: { fontSize: 13, marginTop: 2 },
  note: { fontSize: 12, textAlign: 'center', marginTop: 14 },
});
export default LoginScreen;

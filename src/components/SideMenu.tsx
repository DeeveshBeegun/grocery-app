import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LogoPlaceholder from './LogoPlaceholder';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  'Vegetables & Fruits': 'leaf-outline',
  'Build Package': 'construct-outline',
  'My Cart': 'cart-outline',
  'My Orders': 'receipt-outline',
  Profile: 'person-outline',
  'Contact Us': 'call-outline',
  Settings: 'settings-outline',
  'Admin Dashboard': 'grid-outline',
  'Manage Products': 'pricetags-outline',
  'Add Product': 'add-circle-outline',
  'Manage Orders': 'cube-outline',
  'Manage Packages': 'gift-outline',
};

const SideMenu: React.FC<DrawerContentComponentProps> = (props) => {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { state, navigation } = props;
  const activeRoute = state.routeNames[state.index];

  const confirmLogout = () => {
    if (Platform.OS === 'web') {
      logout();
      return;
    }
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.card }}>
      <View style={[styles.profile, { backgroundColor: colors.primary }]}>
        <LogoPlaceholder size="md" style={{ backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.6)' }} />
        <Text style={styles.name}>{user?.name}</Text>
        <View style={styles.roleRow}>
          <Ionicons name={user?.role === 'admin' ? 'shield-checkmark' : 'person'} size={13} color="#fff" />
          <Text style={styles.role}>{user?.role === 'admin' ? 'Administrator' : 'Customer'}</Text>
        </View>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 8 }}>
        {state.routeNames.map((name, idx) => {
          const focused = idx === state.index;
          return (
            <Pressable
              key={name}
              onPress={() => navigation.navigate(name)}
              style={[styles.item, focused && { backgroundColor: colors.primarySoft }]}
            >
              <View style={[styles.itemIcon, { backgroundColor: focused ? colors.primary : colors.surface }]}>
                <Ionicons name={ICONS[name] ?? 'ellipse-outline'} size={18} color={focused ? colors.onPrimary : colors.textMuted} />
              </View>
              <Text style={[styles.itemText, { color: focused ? colors.primary : colors.text }, focused && { fontWeight: '800' }]}>{name}</Text>
              {focused && <View style={[styles.activeBar, { backgroundColor: colors.primary }]} />}
            </Pressable>
          );
        })}
      </DrawerContentScrollView>

      <Pressable onPress={confirmLogout} style={[styles.logout, { borderTopColor: colors.border }]}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  profile: { paddingTop: 56, paddingBottom: 22, paddingHorizontal: 20, alignItems: 'flex-start' },
  name: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 12 },
  roleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 5 },
  role: { color: '#fff', fontSize: 12, fontWeight: '600', opacity: 0.95 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 14, marginHorizontal: 8, marginVertical: 2, borderRadius: 12 },
  itemIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemText: { fontSize: 15, fontWeight: '600', flex: 1 },
  activeBar: { width: 4, height: 22, borderRadius: 2 },
  logout: { flexDirection: 'row', alignItems: 'center', padding: 18, borderTopWidth: 1, gap: 10 },
  logoutText: { fontSize: 15, fontWeight: '800' },
});
export default SideMenu;

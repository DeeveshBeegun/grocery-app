import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import AdminDashboardCard from '../../components/AdminDashboardCard';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { products, orders } = useData();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const pending = orders.filter((o) => ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup'].includes(o.orderStatus)).length;
    const delivered = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const lowStock = products.filter((p) => p.stock < 10).length;
    const active = orders.filter((o) => ['Out for Delivery', 'Nearby'].includes(o.orderStatus)).length;
    return { total: products.length, totalOrders: orders.length, pending, delivered, lowStock, active };
  }, [products, orders]);

  const styles = makeStyles(colors);

  const actions = [
    { label: 'Add Product', icon: 'add-circle-outline', route: 'Add Product' },
    { label: 'Manage Orders', icon: 'receipt-outline', route: 'Manage Orders' },
    { label: 'Manage Packages', icon: 'cube-outline', route: 'Manage Packages' },
  ] as const;

  return (
    <View style={styles.root}>
      <Header title="Admin Dashboard" showCart={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Hi {user?.name?.split(' ')[0] ?? 'Admin'} 👋</Text>
        <Text style={styles.subtitle}>Here's how your store is doing today.</Text>

        <View style={styles.grid}>
          <View style={styles.gridCell}><AdminDashboardCard label="Total Products" value={stats.total} icon="leaf-outline" /></View>
          <View style={styles.gridCell}><AdminDashboardCard label="Total Orders" value={stats.totalOrders} icon="receipt-outline" /></View>
          <View style={styles.gridCell}><AdminDashboardCard label="Pending Orders" value={stats.pending} icon="hourglass-outline" tint={colors.warning} /></View>
          <View style={styles.gridCell}><AdminDashboardCard label="Delivered" value={stats.delivered} icon="checkmark-done-outline" tint={colors.success} /></View>
          <View style={styles.gridCell}><AdminDashboardCard label="Low Stock" value={stats.lowStock} icon="alert-circle-outline" tint={colors.danger} /></View>
          <View style={styles.gridCell}><AdminDashboardCard label="Active Deliveries" value={stats.active} icon="navigate-outline" tint={colors.info} /></View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          {actions.map((a) => (
            <Pressable key={a.route} style={[styles.action, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate(a.route)}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name={a.icon as any} size={22} color={colors.primaryDark} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    content: { padding: 16, paddingBottom: 40 },
    greeting: { fontSize: 24, fontWeight: '800', color: c.text },
    subtitle: { fontSize: 14, color: c.textMuted, marginTop: 4, marginBottom: 18 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    gridCell: { width: '47.5%', flexGrow: 1 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: c.text, marginTop: 24, marginBottom: 12 },
    actions: { gap: 12 },
    action: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 16, borderWidth: 1 },
    actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    actionLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: c.text },
  });

export default AdminDashboardScreen;

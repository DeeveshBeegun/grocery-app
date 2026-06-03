import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import AdminOrderCard from '../../components/AdminOrderCard';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { Order } from '../../types';

type Filter = 'all' | 'active' | 'delivered';

const ManageOrdersScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { orders } = useData();
  const [filter, setFilter] = useState<Filter>('all');

  const styles = makeStyles(colors);
  const isActive = (o: Order) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled';
  const data = orders.filter((o) => filter === 'all' ? true : filter === 'active' ? isActive(o) : o.orderStatus === 'Delivered');

  const Chip = ({ label, value }: { label: string; value: Filter }) => {
    const active = filter === value;
    return (
      <Pressable onPress={() => setFilter(value)} style={[styles.chip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primarySoft : colors.card }]}>
        <Text style={[styles.chipText, { color: active ? colors.primaryDark : colors.textMuted }]}>{label}</Text>
      </Pressable>
    );
  };

  const open = (orderId: string) => navigation.navigate('AdminOrderDetails', { orderId });

  return (
    <View style={styles.root}>
      <Header title="Manage Orders" showCart={false} />
      <View style={styles.chips}>
        <Chip label="All" value="all" />
        <Chip label="Active" value="active" />
        <Chip label="Delivered" value="delivered" />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AdminOrderCard order={item} onView={() => open(item.orderId)} onUpdate={() => open(item.orderId)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No orders here.</Text>}
      />
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 12 },
    chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1 },
    chipText: { fontSize: 13, fontWeight: '600' },
    list: { padding: 16, gap: 14, paddingBottom: 40 },
    empty: { textAlign: 'center', color: c.textMuted, marginTop: 40, fontSize: 15 },
  });

export default ManageOrdersScreen;

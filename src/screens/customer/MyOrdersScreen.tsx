import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import OrderCard from '../../components/OrderCard';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Order } from '../../types';

type Tab = 'active' | 'past';
const ACTIVE = (o: Order) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled';

const MyOrdersScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { orders, products, packages } = useData();
  const { addProduct, addPackage, addCustomPackage } = useCart();
  const [tab, setTab] = useState<Tab>('active');

  const reorder = (order: Order) => {
    order.items.forEach((it) => {
      if (it.kind === 'package') {
        const pkg = packages.find((p) => p.name === it.name);
        if (pkg) addPackage(pkg, it.quantity);
        else addCustomPackage(it.name, it.price);
      } else {
        const prod = products.find((p) => p.name === it.name);
        if (prod) addProduct(prod, it.quantity);
      }
    });
    navigation.navigate('My Cart');
  };

  const data = orders.filter((o) => (tab === 'active' ? ACTIVE(o) : !ACTIVE(o)));
  const styles = makeStyles(colors);

  const TabBtn = ({ value, label }: { value: Tab; label: string }) => {
    const active = tab === value;
    return (
      <Pressable onPress={() => setTab(value)} style={[styles.tab, active && { backgroundColor: colors.card }]}>
        <Text style={[styles.tabText, { color: active ? colors.primaryDark : colors.textMuted }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <Header title="My Orders" />
      <View style={[styles.tabs, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TabBtn value="active" label="Active" />
        <TabBtn value="past" label="Past" />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onTrack={ACTIVE(item) ? () => navigation.navigate('DeliveryTracking', { orderId: item.orderId }) : undefined}
            onReorder={() => reorder(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>{tab === 'active' ? 'No active orders right now.' : 'No past orders yet.'}</Text>
          </View>
        }
      />
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    tabs: { flexDirection: 'row', margin: 16, marginBottom: 0, padding: 4, borderRadius: 14, borderWidth: 1, gap: 4 },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10 },
    tabText: { fontSize: 14, fontWeight: '700' },
    list: { padding: 16, gap: 14, paddingBottom: 40 },
    empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
    emptyText: { color: c.textMuted, fontSize: 15 },
  });

export default MyOrdersScreen;

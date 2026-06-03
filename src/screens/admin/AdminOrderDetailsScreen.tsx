import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import DeliveryProgressTimeline from '../../components/DeliveryProgressTimeline';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { deliveryStatusFlow, orderStatusFlow } from '../../data/mockData';
import { DeliveryStatus, OrderStatus } from '../../types';
import { formatPrice } from '../../utils/currency';

const AdminOrderDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { getOrder, updateDeliveryStatus, updateOrderStatus } = useData();
  const orderId: string = route.params?.orderId;
  const order = getOrder(orderId);

  const styles = makeStyles(colors);

  if (!order) {
    return (
      <View style={styles.root}>
        <Header title="Order Details" showBack onBack={() => navigation.goBack()} showCart={false} />
        <View style={styles.missing}><Text style={styles.missingText}>Order not found.</Text></View>
      </View>
    );
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>{children}</View>
    </View>
  );

  const Row = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <Header title="Order Details" showBack onBack={() => navigation.goBack()} showCart={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.orderId}>{order.orderId}</Text>
          <StatusBadge status={order.orderStatus} />
        </View>
        <Text style={styles.date}>{order.date}</Text>

        <Section title="Customer">
          <Row icon="person-outline" label="Name" value={order.customerName} />
          <View style={styles.divider} />
          <Row icon="call-outline" label="Phone" value={order.customerPhone} />
          <View style={styles.divider} />
          <Row icon="location-outline" label="Address" value={order.deliveryAddress} />
        </Section>

        <Section title="Items">
          {order.items.map((it, i) => (
            <View key={i}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>{it.quantity} × {it.name}</Text>
                <Text style={styles.itemPrice}>{formatPrice(it.price * it.quantity)}</Text>
              </View>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.itemRow}>
            <Text style={[styles.itemName, { fontWeight: '800' }]}>Total</Text>
            <Text style={[styles.itemPrice, { fontWeight: '800', color: colors.primaryDark }]}>{formatPrice(order.totalAmount)}</Text>
          </View>
          <View style={styles.divider} />
          <Row icon="wallet-outline" label="Payment" value={order.paymentMethod} />
        </Section>

        <Section title="Update Order Status">
          <View style={styles.statusWrap}>
            {orderStatusFlow.map((s) => {
              const active = order.orderStatus === s;
              return (
                <Pressable key={s} onPress={() => updateOrderStatus(orderId, s as OrderStatus)} style={[styles.statusChip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.card }]}>
                  <Text style={[styles.statusChipText, { color: active ? colors.onPrimary : colors.textMuted }]}>{s}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Update Delivery Status">
          <Text style={styles.hint}>Updating this is reflected live on the customer's tracking screen.</Text>
          <View style={styles.statusWrap}>
            {deliveryStatusFlow.map((s) => {
              const active = order.deliveryStatus === s;
              return (
                <Pressable key={s} onPress={() => updateDeliveryStatus(orderId, s as DeliveryStatus)} style={[styles.statusChip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primarySoft : colors.card }]}>
                  <Text style={[styles.statusChipText, { color: active ? colors.primaryDark : colors.textMuted }]}>{s}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Delivery Tracking">
          <Row icon="navigate-outline" label="Status" value={order.deliveryStatus} />
          <View style={styles.divider} />
          <Row icon="speedometer-outline" label="Progress" value={`${order.progressPercentage}%`} />
          <View style={styles.divider} />
          <Row icon="time-outline" label="ETA" value={order.estimatedDeliveryTime} />
          <View style={styles.divider} />
          <Row icon="car-outline" label="Driver" value={order.driverName} />
          <View style={{ marginTop: 14 }}>
            <DeliveryProgressTimeline steps={order.deliverySteps} />
          </View>
        </Section>
      </ScrollView>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    content: { padding: 16, paddingBottom: 40 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    orderId: { fontSize: 22, fontWeight: '800', color: c.text },
    date: { fontSize: 13, color: c.textMuted, marginTop: 2 },
    section: { marginTop: 20 },
    sectionTitle: { fontSize: 15, fontWeight: '800', color: c.text, marginBottom: 10 },
    card: { borderRadius: 16, borderWidth: 1, padding: 14 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 3 },
    rowLabel: { fontSize: 14, color: c.textMuted, width: 70 },
    rowValue: { fontSize: 14, color: c.text, fontWeight: '600', flex: 1, textAlign: 'right' },
    divider: { height: 1, backgroundColor: c.border, marginVertical: 8 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2 },
    itemName: { fontSize: 14, color: c.text, fontWeight: '600' },
    itemPrice: { fontSize: 14, color: c.textMuted },
    statusWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    statusChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
    statusChipText: { fontSize: 12, fontWeight: '700' },
    hint: { fontSize: 12, color: c.textMuted, marginBottom: 10 },
    missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    missingText: { color: c.textMuted, fontSize: 15 },
  });

export default AdminOrderDetailsScreen;

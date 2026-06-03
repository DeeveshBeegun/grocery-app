import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { Order } from '../types';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { formatPrice } from '../utils/currency';

interface Props { order: Order; onView: () => void; onUpdate: () => void; }
const AdminOrderCard: React.FC<Props> = ({ order, onView, onUpdate }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.id, { color: colors.text }]}>{order.orderId}</Text>
          <Text style={[styles.cust, { color: colors.textMuted }]}>
            <Ionicons name="person-outline" size={12} /> {order.customerName} · {order.date}
          </Text>
        </View>
        <Text style={[styles.total, { color: colors.primary }]}>{formatPrice(order.totalAmount)}</Text>
      </View>
      <View style={styles.badges}>
        <StatusBadge status={order.orderStatus} />
        <StatusBadge status={order.deliveryStatus} />
      </View>
      <View style={styles.actions}>
        <Button title="View Details" variant="outline" size="sm" icon="eye-outline" onPress={onView} style={{ flex: 1, marginRight: 8 }} />
        <Button title="Update Status" size="sm" icon="sync-outline" onPress={onUpdate} style={{ flex: 1 }} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 14 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  id: { fontSize: 16, fontWeight: '900' },
  cust: { fontSize: 12, marginTop: 3 },
  total: { fontSize: 18, fontWeight: '900' },
  badges: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  actions: { flexDirection: 'row', marginTop: 14 },
});
export default AdminOrderCard;

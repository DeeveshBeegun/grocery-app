import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { Order } from '../types';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { formatPrice } from '../utils/currency';

interface Props {
  order: Order;
  onTrack?: () => void;
  onReorder?: () => void;
}
const isActive = (o: Order) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled';

const OrderCard: React.FC<Props> = ({ order, onTrack, onReorder }) => {
  const { colors } = useTheme();
  const itemSummary = order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ');
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.top}>
        <View>
          <Text style={[styles.id, { color: colors.text }]}>{order.orderId}</Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>{order.date}</Text>
        </View>
        <StatusBadge status={order.orderStatus} />
      </View>
      <Text style={[styles.items, { color: colors.textMuted }]} numberOfLines={2}>
        <Ionicons name="bag-handle-outline" size={13} color={colors.textMuted} /> {itemSummary}
      </Text>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.bottom}>
        <View>
          <Text style={[styles.totalLabel, { color: colors.textMuted }]}>Total</Text>
          <Text style={[styles.total, { color: colors.primary }]}>{formatPrice(order.totalAmount)}</Text>
        </View>
        <View style={styles.actions}>
          {onReorder && <Button title="Reorder" variant="outline" size="sm" icon="repeat" fullWidth={false} onPress={onReorder} style={{ marginRight: 8 }} />}
          {isActive(order) && onTrack && <Button title="Track Order" size="sm" icon="navigate" fullWidth={false} onPress={onTrack} />}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 14 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  id: { fontSize: 16, fontWeight: '900' },
  date: { fontSize: 12, marginTop: 2 },
  items: { fontSize: 13, marginTop: 10 },
  divider: { height: 1, marginVertical: 12 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 11 },
  total: { fontSize: 18, fontWeight: '900' },
  actions: { flexDirection: 'row', alignItems: 'center' },
});
export default OrderCard;

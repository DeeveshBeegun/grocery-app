import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { Order } from '../types';
import StatusBadge from './StatusBadge';

interface Props { order: Order; }
const TrackingStatusCard: React.FC<Props> = ({ order }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.top}>
        <View>
          <Text style={[styles.muted, { color: colors.textMuted }]}>Order</Text>
          <Text style={[styles.id, { color: colors.text }]}>{order.orderId}</Text>
        </View>
        <StatusBadge status={order.deliveryStatus} />
      </View>
      <View style={[styles.track, { backgroundColor: colors.surface }]}>
        <View style={[styles.fill, { width: `${order.progressPercentage}%`, backgroundColor: colors.primary }]} />
      </View>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={16} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.text }]}>{order.estimatedDeliveryTime}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.text }]} numberOfLines={1}>{order.deliveryAddress}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 16 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  muted: { fontSize: 12 },
  id: { fontSize: 20, fontWeight: '900' },
  track: { height: 8, borderRadius: 5, marginTop: 14, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 5 },
  metaRow: { marginTop: 14, gap: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 13, fontWeight: '600', flex: 1 },
});
export default TrackingStatusCard;

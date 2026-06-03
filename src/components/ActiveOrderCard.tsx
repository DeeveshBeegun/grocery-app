import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { Order } from '../types';

interface Props { order: Order; onTrack: () => void; }
const ActiveOrderCard: React.FC<Props> = ({ order, onTrack }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.primary }]}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="bicycle" size={26} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.label}>Active order · {order.orderId}</Text>
          <Text style={styles.status}>{order.deliveryStatus}</Text>
          <Text style={styles.eta}>Arrives in {order.estimatedDeliveryTime}</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${order.progressPercentage}%` }]} />
      </View>
      <Pressable onPress={onTrack} style={styles.btn}>
        <Ionicons name="navigate" size={16} color={colors.primary} />
        <Text style={[styles.btnText, { color: colors.primary }]}>Track Order</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 16, marginBottom: 18,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 50, height: 50, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  label: { color: '#fff', fontSize: 12, opacity: 0.9, fontWeight: '600' },
  status: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 2 },
  eta: { color: '#fff', fontSize: 13, opacity: 0.95, marginTop: 2 },
  progressTrack: { height: 6, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)', marginTop: 14, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 4, backgroundColor: '#fff' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 11, marginTop: 14, gap: 6 },
  btnText: { fontWeight: '800', fontSize: 14 },
});
export default ActiveOrderCard;

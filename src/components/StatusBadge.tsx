import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { OrderStatus, DeliveryStatus } from '../types';

const colorFor = (status: string, theme: ReturnType<typeof useTheme>['colors']) => {
  switch (status) {
    case 'Delivered': return theme.success;
    case 'Cancelled': return theme.danger;
    case 'Out for Delivery':
    case 'Nearby': return theme.info;
    case 'Pending':
    case 'Order Placed': return theme.warning;
    default: return theme.primary;
  }
};

interface Props { status: OrderStatus | DeliveryStatus | string; }
const StatusBadge: React.FC<Props> = ({ status }) => {
  const { colors } = useTheme();
  const c = colorFor(status, colors);
  return (
    <View style={[styles.badge, { backgroundColor: c + '22' }]}>
      <View style={[styles.dot, { backgroundColor: c }]} />
      <Text style={[styles.text, { color: c }]}>{status}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start' },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  text: { fontSize: 12, fontWeight: '700' },
});
export default StatusBadge;

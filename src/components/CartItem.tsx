import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { CartLine } from '../types';
import QuantitySelector from './QuantitySelector';
import { formatPrice } from '../utils/currency';

interface Props {
  line: CartLine;
  onChangeQty: (n: number) => void;
  onRemove: () => void;
}
const CartItem: React.FC<Props> = ({ line, onChangeQty, onRemove }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={line.kind === 'package' ? 'cube' : 'leaf'} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{line.name}</Text>
        <Text style={[styles.price, { color: colors.textMuted }]}>{formatPrice(line.price)} / {line.unitLabel}</Text>
        <View style={styles.bottom}>
          <QuantitySelector value={line.quantity} onChange={onChangeQty} size="sm" min={1} />
          <Text style={[styles.lineTotal, { color: colors.primary }]}>{formatPrice(line.price * line.quantity)}</Text>
        </View>
      </View>
      <Pressable onPress={onRemove} hitSlop={10} style={styles.remove}>
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  card: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 12, marginBottom: 12 },
  icon: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '800' },
  price: { fontSize: 12, marginTop: 2 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  lineTotal: { fontSize: 16, fontWeight: '900' },
  remove: { padding: 4, marginLeft: 6 },
});
export default CartItem;

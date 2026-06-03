import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { Product } from '../types';
import ProductImage from './ProductImage';
import QuantitySelector from './QuantitySelector';
import { formatPrice } from '../utils/currency';

interface Props {
  product: Product;
  onPress?: () => void;
  onAdd?: (qty: number) => void;
  compact?: boolean;
}
const ProductCard: React.FC<Props> = ({ product, onPress, onAdd, compact }) => {
  const { colors } = useTheme();
  const [qty, setQty] = useState(1);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border }, compact && { width: 168 }, pressed && { opacity: 0.92 }]}>
      <View>
        <ProductImage uri={product.image} type={product.type} height={compact ? 96 : 110} />
        <View style={[styles.typePill, { backgroundColor: colors.primary }]}>
          <Text style={styles.typeText}>{product.type}</Text>
        </View>
        {!product.inStock && (
          <View style={styles.oos}><Text style={styles.oosText}>Out of stock</Text></View>
        )}
      </View>
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{product.name}</Text>
      <Text style={[styles.desc, { color: colors.textMuted }]} numberOfLines={2}>{product.description}</Text>
      <View style={styles.priceRow}>
        <Text style={[styles.price, { color: colors.primary }]}>{formatPrice(product.price)}</Text>
        <Text style={[styles.unit, { color: colors.textMuted }]}>/{product.unit}</Text>
      </View>
      {onAdd && (
        <View style={styles.actions}>
          <QuantitySelector value={qty} onChange={setQty} size="sm" />
          <Pressable
            onPress={() => product.inStock && onAdd(qty)}
            style={[styles.addBtn, { backgroundColor: product.inStock ? colors.primary : colors.border }]}
          >
            <Ionicons name="cart" size={16} color={colors.onPrimary} />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 10, margin: 6,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  typePill: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  typeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  oos: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  oosText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  name: { fontSize: 15, fontWeight: '800', marginTop: 8 },
  desc: { fontSize: 12, marginTop: 2, minHeight: 32 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6 },
  price: { fontSize: 17, fontWeight: '900' },
  unit: { fontSize: 12, marginLeft: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  addBtn: { width: 38, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
export default ProductCard;

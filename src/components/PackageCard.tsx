import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { ProductPackage } from '../types';
import ProductImage from './ProductImage';
import { formatPrice } from '../utils/currency';

interface Props {
  pkg: ProductPackage;
  onAdd?: () => void;
  onPress?: () => void;
  horizontal?: boolean;
}
const PackageCard: React.FC<Props> = ({ pkg, onAdd, onPress, horizontal }) => {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border }, horizontal && { width: 240 }, pressed && { opacity: 0.92 }]}>
      <ProductImage uri={pkg.image} height={96} />
      <View style={[styles.sizePill, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name="cube" size={12} color={colors.primary} />
        <Text style={[styles.sizeText, { color: colors.primary }]}>{pkg.size}</Text>
      </View>
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{pkg.name}</Text>
      <Text style={[styles.desc, { color: colors.textMuted }]} numberOfLines={2}>{pkg.description}</Text>
      <View style={styles.row}>
        <Text style={[styles.meta, { color: colors.textMuted }]}>{pkg.items.length} items</Text>
        <Text style={[styles.price, { color: colors.primary }]}>{formatPrice(pkg.price)}</Text>
      </View>
      {onAdd && (
        <Pressable onPress={onAdd} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Ionicons name="cart" size={15} color={colors.onPrimary} />
          <Text style={[styles.addText, { color: colors.onPrimary }]}>Add to Cart</Text>
        </Pressable>
      )}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 10, margin: 6,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  sizePill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 8 },
  sizeText: { fontSize: 11, fontWeight: '800', marginLeft: 4 },
  name: { fontSize: 15, fontWeight: '800', marginTop: 6 },
  desc: { fontSize: 12, marginTop: 2, minHeight: 32 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  meta: { fontSize: 12, fontWeight: '600' },
  price: { fontSize: 17, fontWeight: '900' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 9, marginTop: 10 },
  addText: { fontWeight: '700', marginLeft: 6, fontSize: 13 },
});
export default PackageCard;

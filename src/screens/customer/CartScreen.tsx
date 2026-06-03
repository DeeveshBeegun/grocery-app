import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import CartItem from '../../components/CartItem';
import Button from '../../components/Button';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';

const CartScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { items, subtotal, deliveryFee, total, updateQuantity, removeItem } = useCart();
  const styles = makeStyles(colors);

  if (items.length === 0) {
    return (
      <View style={styles.root}>
        <Header title="My Cart" />
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="cart-outline" size={48} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Browse fresh produce and add items to get started.</Text>
          <Button title="Start Shopping" icon="leaf-outline" fullWidth={false} onPress={() => navigation.navigate('Vegetables & Fruits')} style={{ marginTop: 16 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Header title="My Cart" />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CartItem line={item} onChangeQty={(n) => updateQuantity(item.id, n)} onRemove={() => removeItem(item.id)} />
        )}
      />

      <View style={[styles.summary, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Subtotal</Text>
          <Text style={styles.rowValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Delivery fee</Text>
          <Text style={styles.rowValue}>{formatPrice(deliveryFee)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.primaryDark }]}>{formatPrice(total)}</Text>
        </View>
        <Button title="Proceed to Checkout" icon="arrow-forward" onPress={() => navigation.navigate('Checkout')} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    list: { padding: 16, paddingBottom: 24, gap: 12 },
    summary: { padding: 16, borderTopWidth: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
    rowLabel: { fontSize: 14, color: c.textMuted },
    rowValue: { fontSize: 14, color: c.text, fontWeight: '600' },
    divider: { height: 1, backgroundColor: c.border, marginVertical: 8 },
    totalLabel: { fontSize: 17, fontWeight: '800', color: c.text },
    totalValue: { fontSize: 22, fontWeight: '800' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    emptyIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: '800', color: c.text },
    emptyText: { fontSize: 14, color: c.textMuted, textAlign: 'center', marginTop: 8 },
  });

export default CartScreen;

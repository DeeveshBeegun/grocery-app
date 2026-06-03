import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import ProductImage from '../../components/ProductImage';
import Button from '../../components/Button';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';

const ManageProductsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { products, deleteProduct } = useData();
  const [filter, setFilter] = useState<'all' | 'Vegetable' | 'Fruit'>('all');

  const styles = makeStyles(colors);
  const data = products.filter((p) => filter === 'all' || p.type === filter);

  const confirmDelete = (p: Product) => {
    if (Platform.OS === 'web') {
      deleteProduct(p.id);
      return;
    }
    Alert.alert('Delete product', `Remove "${p.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(p.id) },
    ]);
  };

  const Chip = ({ label, value }: { label: string; value: typeof filter }) => {
    const active = filter === value;
    return (
      <Pressable onPress={() => setFilter(value)} style={[styles.chip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primarySoft : colors.card }]}>
        <Text style={[styles.chipText, { color: active ? colors.primaryDark : colors.textMuted }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <Header title="Manage Products" showCart={false} />
      <View style={styles.topBar}>
        <View style={styles.chips}>
          <Chip label="All" value="all" />
          <Chip label="Vegetables" value="Vegetable" />
          <Chip label="Fruits" value="Fruit" />
        </View>
        <Button title="Add" icon="add" size="sm" fullWidth={false} onPress={() => navigation.navigate('AddEditProduct', {})} />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ProductImage uri={item.image} type={item.type} height={64} radius={12} iconSize={26} style={{ width: 64 }} />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.meta}>{item.type} · {item.category}</Text>
              <View style={styles.metaRow}>
                <Text style={[styles.price, { color: colors.primaryDark }]}>{formatPrice(item.price)}/{item.unit}</Text>
                <View style={[styles.stockPill, { backgroundColor: item.stock < 10 ? '#FDECEC' : colors.primarySoft }]}>
                  <Text style={[styles.stockText, { color: item.stock < 10 ? colors.danger : colors.primaryDark }]}>
                    {item.inStock ? `${item.stock} in stock` : 'Out of stock'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable style={[styles.iconBtn, { backgroundColor: colors.primarySoft }]} onPress={() => navigation.navigate('AddEditProduct', { product: item })}>
                <Ionicons name="create-outline" size={18} color={colors.primaryDark} />
              </Pressable>
              <Pressable style={[styles.iconBtn, { backgroundColor: '#FDECEC' }]} onPress={() => confirmDelete(item)}>
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No products yet.</Text>}
      />
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, gap: 12 },
    chips: { flexDirection: 'row', gap: 8, flex: 1 },
    chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, borderWidth: 1 },
    chipText: { fontSize: 12, fontWeight: '600' },
    list: { padding: 16, gap: 12, paddingBottom: 40 },
    card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 10 },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: '700', color: c.text },
    meta: { fontSize: 12, color: c.textMuted, marginTop: 2 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' },
    price: { fontSize: 13, fontWeight: '700' },
    stockPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    stockText: { fontSize: 11, fontWeight: '700' },
    actions: { gap: 8 },
    iconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    empty: { textAlign: 'center', color: c.textMuted, marginTop: 40, fontSize: 15 },
  });

export default ManageProductsScreen;

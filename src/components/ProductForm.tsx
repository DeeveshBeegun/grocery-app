import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Product, ProductType, Unit } from '../types';
import InputField from './InputField';
import ImageUploadPicker from './ImageUploadPicker';
import Button from './Button';

interface Props {
  initial?: Product;
  onSave: (p: Product) => void;
  onCancel: () => void;
}
const TYPES: ProductType[] = ['Vegetable', 'Fruit'];
const UNITS: Unit[] = ['kg', 'piece', 'bunch', 'pack'];
const CATEGORIES = ['Fruiting Vegetables', 'Root Vegetables', 'Leafy Greens', 'Organic', 'Tropical', 'Citrus', 'Berries', 'Melons'];

const uid = () => 'p' + Math.random().toString(36).slice(2, 8);

const ProductForm: React.FC<Props> = ({ initial, onSave, onCancel }) => {
  const { colors } = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState<ProductType>(initial?.type ?? 'Vegetable');
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [price, setPrice] = useState(initial ? String(initial.price) : '');
  const [unit, setUnit] = useState<Unit>(initial?.unit ?? 'kg');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [stock, setStock] = useState(initial ? String(initial.stock) : '');
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [image, setImage] = useState<string | null>(initial?.image ?? null);
  const [error, setError] = useState('');

  const submit = () => {
    if (!name.trim()) return setError('Product name is required');
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return setError('Enter a valid price');
    const stockNum = parseInt(stock || '0', 10);
    onSave({
      id: initial?.id ?? uid(),
      name: name.trim(),
      type,
      category,
      price: priceNum,
      unit,
      description: description.trim(),
      stock: stockNum,
      inStock,
      image,
      featured: initial?.featured,
      popular: initial?.popular,
    });
  };

  const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <Pressable onPress={onPress} style={[styles.chip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.surface }]}>
      <Text style={[styles.chipText, { color: active ? colors.onPrimary : colors.text }]}>{label}</Text>
    </Pressable>
  );

  return (
    <View>
      <ImageUploadPicker value={image} onChange={setImage} />
      <InputField label="Product Name" value={name} onChangeText={setName} placeholder="e.g. Tomato" icon="pricetag-outline" />

      <Text style={[styles.label, { color: colors.text }]}>Product Type</Text>
      <View style={styles.row}>{TYPES.map((t) => <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} />)}</View>

      <Text style={[styles.label, { color: colors.text }]}>Category</Text>
      <View style={styles.rowWrap}>{CATEGORIES.map((c) => <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />)}</View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
        <InputField containerStyle={{ flex: 1 }} label="Price (Rs)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="1.80" icon="cash-outline" />
        <InputField containerStyle={{ flex: 1 }} label="Stock Qty" value={stock} onChangeText={setStock} keyboardType="number-pad" placeholder="100" icon="cube-outline" />
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Unit</Text>
      <View style={styles.row}>{UNITS.map((u) => <Chip key={u} label={u} active={unit === u} onPress={() => setUnit(u)} />)}</View>

      <InputField label="Description" value={description} onChangeText={setDescription} placeholder="Short description" multiline numberOfLines={3} containerStyle={{ marginTop: 14 }} style={{ height: 70, textAlignVertical: 'top' }} />

      <View style={[styles.toggleRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.toggleLabel, { color: colors.text }]}>Available in stock</Text>
          <Text style={[styles.toggleSub, { color: colors.textMuted }]}>Customers can order this item</Text>
        </View>
        <Switch value={inStock} onValueChange={setInStock} trackColor={{ true: colors.primary, false: colors.border }} thumbColor="#fff" />
      </View>

      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 18 }}>
        <Button title="Cancel" variant="outline" icon="close" onPress={onCancel} style={{ flex: 1 }} />
        <Button title="Save Product" icon="checkmark" onPress={submit} style={{ flex: 1 }} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 4 },
  row: { flexDirection: 'row', gap: 8 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  chipText: { fontWeight: '700', fontSize: 13 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 14 },
  toggleLabel: { fontSize: 15, fontWeight: '700' },
  toggleSub: { fontSize: 12, marginTop: 2 },
  error: { marginTop: 12, fontWeight: '700' },
});
export default ProductForm;

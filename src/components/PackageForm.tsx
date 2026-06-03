import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { ProductPackage, PackageSize, PackageItem, Product } from '../types';
import InputField from './InputField';
import ImageUploadPicker from './ImageUploadPicker';
import Button from './Button';
import QuantitySelector from './QuantitySelector';
import { formatPrice } from '../utils/currency';

interface Props {
  initial?: ProductPackage;
  products: Product[];
  onSave: (p: ProductPackage) => void;
  onCancel: () => void;
}
const SIZES: PackageSize[] = ['Small', 'Medium', 'Large', 'Family Pack'];
const uid = () => 'pk' + Math.random().toString(36).slice(2, 8);

const PackageForm: React.FC<Props> = ({ initial, products, onSave, onCancel }) => {
  const { colors } = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [size, setSize] = useState<PackageSize>(initial?.size ?? 'Medium');
  const [price, setPrice] = useState(initial ? String(initial.price) : '');
  const [image, setImage] = useState<string | null>(initial?.image ?? null);
  const [items, setItems] = useState<PackageItem[]>(initial?.items ?? []);
  const [error, setError] = useState('');

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.some((i) => i.productId === id)
        ? prev.filter((i) => i.productId !== id)
        : [...prev, { productId: id, quantity: 1 }]
    );
  };
  const setQty = (id: string, q: number) =>
    setItems((prev) => prev.map((i) => (i.productId === id ? { ...i, quantity: q } : i)));

  const submit = () => {
    if (!name.trim()) return setError('Package name is required');
    if (items.length === 0) return setError('Select at least one product');
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return setError('Enter a valid price');
    onSave({
      id: initial?.id ?? uid(),
      name: name.trim(),
      description: description.trim(),
      size,
      price: priceNum,
      image,
      items,
      popular: initial?.popular,
    });
  };

  return (
    <View>
      <ImageUploadPicker value={image} onChange={setImage} label="Package Image" />
      <InputField label="Package Name" value={name} onChangeText={setName} placeholder="e.g. Weekly Essentials Pack" icon="gift-outline" />
      <InputField label="Description" value={description} onChangeText={setDescription} placeholder="Short description" multiline style={{ height: 64, textAlignVertical: 'top' }} />

      <Text style={[styles.label, { color: colors.text }]}>Package Size</Text>
      <View style={styles.rowWrap}>
        {SIZES.map((s) => (
          <Pressable key={s} onPress={() => setSize(s)} style={[styles.chip, { borderColor: size === s ? colors.primary : colors.border, backgroundColor: size === s ? colors.primary : colors.surface }]}>
            <Text style={[styles.chipText, { color: size === s ? colors.onPrimary : colors.text }]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>Select Products ({items.length})</Text>
      <View style={[styles.list, { borderColor: colors.border }]}>
        {products.map((p) => {
          const selected = items.find((i) => i.productId === p.id);
          return (
            <View key={p.id} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
              <Pressable onPress={() => toggle(p.id)} style={styles.itemLeft}>
                <Ionicons name={selected ? 'checkbox' : 'square-outline'} size={22} color={selected ? colors.primary : colors.textMuted} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{p.name}</Text>
                  <Text style={[styles.itemMeta, { color: colors.textMuted }]}>{p.type} · {formatPrice(p.price)}/{p.unit}</Text>
                </View>
              </Pressable>
              {selected && <QuantitySelector value={selected.quantity} onChange={(q) => setQty(p.id, q)} size="sm" />}
            </View>
          );
        })}
      </View>

      <InputField label="Package Price (Rs)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="14.90" icon="cash-outline" containerStyle={{ marginTop: 16 }} />

      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
        <Button title="Cancel" variant="outline" icon="close" onPress={onCancel} style={{ flex: 1 }} />
        <Button title="Save Package" icon="checkmark" onPress={submit} style={{ flex: 1 }} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  chipText: { fontWeight: '700', fontSize: 13 },
  list: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700' },
  itemMeta: { fontSize: 12, marginTop: 1 },
  error: { marginVertical: 12, fontWeight: '700' },
});
export default PackageForm;

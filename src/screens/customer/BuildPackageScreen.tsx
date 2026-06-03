import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import QuantitySelector from '../../components/QuantitySelector';
import ProductImage from '../../components/ProductImage';
import PackageCard from '../../components/PackageCard';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { PackageSize } from '../../types';
import { formatPrice } from '../../utils/currency';

const SIZES: PackageSize[] = ['Small', 'Medium', 'Large', 'Family Pack'];

const BuildPackageScreen: React.FC = () => {
  const { colors } = useTheme();
  const { products, packages } = useData();
  const { addCustomPackage, addPackage } = useCart();

  const [name, setName] = useState('');
  const [size, setSize] = useState<PackageSize>('Medium');
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
  };

  const setQty = (id: string, q: number) => setSelected((prev) => ({ ...prev, [id]: q }));

  const selectedList = useMemo(
    () => Object.entries(selected).map(([id, q]) => ({ product: products.find((p) => p.id === id)!, qty: q })).filter((x) => x.product),
    [selected, products]
  );

  const estimatedTotal = useMemo(
    () => selectedList.reduce((sum, x) => sum + x.product.price * x.qty, 0),
    [selectedList]
  );

  const handleAdd = () => {
    if (!name.trim()) { setError('Please name your package.'); return; }
    if (selectedList.length === 0) { setError('Add at least one item to your package.'); return; }
    setError('');
    addCustomPackage(`${name.trim()} (${size})`, Number(estimatedTotal.toFixed(2)));
    setConfirmed(true);
    setName('');
    setSelected({});
    setSize('Medium');
    setTimeout(() => setConfirmed(false), 1800);
  };

  const styles = makeStyles(colors);

  return (
    <View style={styles.root}>
      <Header title="Build Package" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Build Your Package</Text>
        <Text style={styles.subtitle}>Mix and match your favourite vegetables and fruits into a custom box.</Text>

        <InputField label="Package name" icon="pricetag-outline" placeholder="e.g. My Weekly Box" value={name} onChangeText={setName} />

        <Text style={styles.label}>Package size</Text>
        <View style={styles.sizeRow}>
          {SIZES.map((s) => {
            const active = size === s;
            return (
              <Pressable
                key={s}
                onPress={() => setSize(s)}
                style={[styles.sizeChip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primarySoft : colors.card }]}
              >
                <Text style={[styles.sizeText, { color: active ? colors.primaryDark : colors.textMuted }]}>{s}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Choose items</Text>
        <View style={styles.itemsWrap}>
          {products.map((p) => {
            const isSel = selected[p.id] !== undefined;
            return (
              <View key={p.id} style={[styles.itemRow, { borderColor: isSel ? colors.primary : colors.border }]}>
                <ProductImage uri={p.image} type={p.type} height={48} radius={10} iconSize={22} style={{ width: 48 }} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{p.name}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(p.price)} / {p.unit}</Text>
                </View>
                {isSel ? (
                  <QuantitySelector value={selected[p.id]} onChange={(q) => setQty(p.id, q)} size="sm" />
                ) : null}
                <Pressable onPress={() => toggle(p.id)} disabled={!p.inStock} style={[styles.addBtn, { backgroundColor: isSel ? colors.danger : (p.inStock ? colors.primary : colors.border) }]}>
                  <Ionicons name={isSel ? 'remove' : 'add'} size={18} color={colors.onPrimary} />
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={[styles.summary, { backgroundColor: colors.primarySoft, borderColor: colors.primaryLight }]}>
          <Text style={styles.summaryTitle}>Package Summary</Text>
          {selectedList.length === 0 ? (
            <Text style={styles.summaryEmpty}>No items selected yet.</Text>
          ) : (
            selectedList.map((x) => (
              <View key={x.product.id} style={styles.summaryRow}>
                <Text style={styles.summaryItem} numberOfLines={1}>{x.qty} × {x.product.name}</Text>
                <Text style={styles.summaryItemPrice}>{formatPrice(x.product.price * x.qty)}</Text>
              </View>
            ))
          )}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Estimated total</Text>
            <Text style={[styles.summaryTotal, { color: colors.primaryDark }]}>{formatPrice(estimatedTotal)}</Text>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={confirmed ? 'Package Added ✓' : 'Add Package to Cart'} icon={confirmed ? undefined : 'cart-outline'} variant={confirmed ? 'outline' : 'primary'} onPress={handleAdd} style={{ marginTop: 12 }} />

        <Text style={[styles.title, { marginTop: 32, fontSize: 20 }]}>Ready-Made Packages</Text>
        <Text style={styles.subtitle}>Prefer a curated box? Add one of ours in a tap.</Text>
        <View style={styles.readyWrap}>
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onAdd={() => addPackage(pkg)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    content: { padding: 16, paddingBottom: 40 },
    title: { fontSize: 24, fontWeight: '800', color: c.text },
    subtitle: { fontSize: 14, color: c.textMuted, marginTop: 4, marginBottom: 16 },
    label: { fontSize: 15, fontWeight: '700', color: c.text, marginTop: 18, marginBottom: 10 },
    sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    sizeChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
    sizeText: { fontSize: 14, fontWeight: '600' },
    itemsWrap: { gap: 10 },
    itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.card, borderRadius: 14, borderWidth: 1, padding: 8 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 14, fontWeight: '700', color: c.text },
    itemPrice: { fontSize: 12, color: c.textMuted, marginTop: 2 },
    addBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    summary: { borderRadius: 18, borderWidth: 1, padding: 16, marginTop: 22 },
    summaryTitle: { fontSize: 16, fontWeight: '800', color: c.text, marginBottom: 10 },
    summaryEmpty: { fontSize: 14, color: c.textMuted },
    summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 3 },
    summaryItem: { fontSize: 14, color: c.text, flex: 1, marginRight: 8 },
    summaryItemPrice: { fontSize: 14, color: c.textMuted, fontWeight: '600' },
    summaryDivider: { height: 1, backgroundColor: c.primaryLight, marginVertical: 10, opacity: 0.5 },
    summaryTotalLabel: { fontSize: 15, fontWeight: '700', color: c.text },
    summaryTotal: { fontSize: 20, fontWeight: '800' },
    error: { color: c.danger, fontSize: 13, marginTop: 12 },
    readyWrap: { gap: 14, marginTop: 14 },
  });

export default BuildPackageScreen;

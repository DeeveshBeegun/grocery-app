import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import ProductCard from '../../components/ProductCard';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { ProductType } from '../../types';

type TypeFilter = 'all' | ProductType;
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

const ProductsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { products } = useData();
  const { addProduct } = useCart();
  const searchRef = useRef<TextInput>(null);

  const initialType: TypeFilter = route.params?.initialType && route.params.initialType !== 'package'
    ? route.params.initialType
    : 'all';
  const initialCategory: string | undefined = route.params?.initialCategory;

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(initialType);
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [sort, setSort] = useState<SortKey>('featured');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (route.params?.focusSearch) {
      const t = setTimeout(() => searchRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [route.params?.focusSearch]);

  useEffect(() => {
    if (route.params?.initialType && route.params.initialType !== 'package') {
      setTypeFilter(route.params.initialType);
    }
    if (route.params?.initialCategory !== undefined) {
      setCategory(route.params.initialCategory);
    }
  }, [route.params?.initialType, route.params?.initialCategory]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.slice();
    if (typeFilter !== 'all') list = list.filter((p) => p.type === typeFilter);
    if (category) {
      if (category === 'Organic') list = list.filter((p) => p.category === 'Organic Picks' || p.category === 'Organic');
      else list = list.filter((p) => p.category === category);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  }, [products, typeFilter, category, query, sort]);

  const styles = makeStyles(colors);
  const sortLabels: Record<SortKey, string> = {
    featured: 'Featured', 'price-asc': 'Price: Low to High', 'price-desc': 'Price: High to Low', name: 'Name A-Z',
  };

  const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primarySoft : colors.card }]}
    >
      <Text style={[styles.chipText, { color: active ? colors.primaryDark : colors.textMuted }]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <Header title="Vegetables & Fruits" />

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          ref={searchRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Search vegetables & fruits"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          <Chip label="All" active={typeFilter === 'all' && !category} onPress={() => { setTypeFilter('all'); setCategory(undefined); }} />
          <Chip label="Vegetables" active={typeFilter === 'Vegetable'} onPress={() => setTypeFilter('Vegetable')} />
          <Chip label="Fruits" active={typeFilter === 'Fruit'} onPress={() => setTypeFilter('Fruit')} />
          {categoryOptions.map((c) => (
            <Chip key={c} label={c} active={category === c} onPress={() => setCategory(category === c ? undefined : c)} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.resultCount}>{filtered.length} item{filtered.length === 1 ? '' : 's'}</Text>
        <Pressable style={styles.sortBtn} onPress={() => setSortOpen((o) => !o)}>
          <Ionicons name="swap-vertical" size={16} color={colors.primaryDark} />
          <Text style={styles.sortBtnText}>{sortLabels[sort]}</Text>
          <Ionicons name={sortOpen ? 'chevron-up' : 'chevron-down'} size={14} color={colors.primaryDark} />
        </Pressable>
      </View>

      {sortOpen && (
        <View style={styles.sortMenu}>
          {(Object.keys(sortLabels) as SortKey[]).map((k) => (
            <Pressable key={k} style={styles.sortOption} onPress={() => { setSort(k); setSortOpen(false); }}>
              <Text style={[styles.sortOptionText, { color: sort === k ? colors.primaryDark : colors.text }]}>{sortLabels[k]}</Text>
              {sort === k && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
          ))}
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
              onAdd={(qty) => addProduct(item, qty)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="basket-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No products match your search.</Text>
          </View>
        }
      />
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    searchWrap: {
      flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.card,
      marginHorizontal: 16, marginTop: 12, paddingHorizontal: 14, height: 46, borderRadius: 14,
      borderWidth: 1, borderColor: c.border,
    },
    searchInput: { flex: 1, color: c.text, fontSize: 15 },
    filterRow: { marginTop: 12 },
    chipScroll: { paddingHorizontal: 16, gap: 8 },
    chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    chipText: { fontSize: 13, fontWeight: '600' },
    sortRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 12 },
    resultCount: { color: c.textMuted, fontSize: 13, fontWeight: '600' },
    sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: c.primarySoft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
    sortBtnText: { color: c.primaryDark, fontSize: 13, fontWeight: '700' },
    sortMenu: { backgroundColor: c.card, marginHorizontal: 16, marginTop: 8, borderRadius: 12, borderWidth: 1, borderColor: c.border, overflow: 'hidden' },
    sortOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    sortOptionText: { fontSize: 14, fontWeight: '500' },
    list: { padding: 16, paddingBottom: 40 },
    column: { gap: 12 },
    cell: { flex: 1, marginBottom: 12 },
    empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
    emptyText: { color: c.textMuted, fontSize: 15 },
  });

export default ProductsScreen;

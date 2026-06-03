import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/mockData';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';
import ProductCard from '../../components/ProductCard';
import PackageCard from '../../components/PackageCard';
import ActiveOrderCard from '../../components/ActiveOrderCard';
import { Category } from '../../types';

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { products, packages, orders } = useData();
  const { addProduct, addPackage } = useCart();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 6), [products]);
  const popularPackages = useMemo(() => packages.filter((p) => p.popular), [packages]);
  const activeOrder = useMemo(
    () => orders.find((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'),
    [orders]
  );

  const onCategory = (cat: Category) => {
    if (cat.filterType === 'package') {
      navigation.navigate('Build Package');
      return;
    }
    navigation.navigate('Vegetables & Fruits', {
      screen: 'ProductsMain',
      params: { initialType: cat.filterType, initialCategory: cat.categoryKey },
    });
  };

  const openProduct = (id: string) => navigation.navigate('ProductDetails', { id });
  const track = (orderId: string) => navigation.navigate('DeliveryTracking', { orderId });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Search */}
        <Pressable
          onPress={() => navigation.navigate('Vegetables & Fruits', { screen: 'ProductsMain', params: { focusSearch: true } })}
          style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <Text style={[styles.searchText, { color: colors.textMuted }]}>Search vegetables, fruits...</Text>
        </Pressable>

        {/* Welcome */}
        <View style={styles.welcomeWrap}>
          <Text style={[styles.hello, { color: colors.textMuted }]}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={[styles.welcome, { color: colors.text }]}>What fresh produce do you need today?</Text>
        </View>

        {/* Promo banner */}
        <View style={[styles.banner, { backgroundColor: colors.primary }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTag}>FRESH DEAL</Text>
            <Text style={styles.bannerTitle}>Up to 20% off{'\n'}your first order</Text>
            <Pressable onPress={() => navigation.navigate('Vegetables & Fruits')} style={styles.bannerBtn}>
              <Text style={[styles.bannerBtnText, { color: colors.primary }]}>Shop now</Text>
            </Pressable>
          </View>
          <Ionicons name="basket" size={72} color="rgba(255,255,255,0.3)" />
        </View>

        {/* Active order */}
        {activeOrder && (
          <View style={styles.section}>
            <ActiveOrderCard order={activeOrder} onTrack={() => track(activeOrder.orderId)} />
          </View>
        )}

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: 14 }}
          renderItem={({ item }) => <CategoryCard category={item} onPress={() => onCategory(item)} />}
        />

        {/* Featured */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
          <Pressable onPress={() => navigation.navigate('Vegetables & Fruits')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={featured}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          renderItem={({ item }) => (
            <View style={{ width: 180 }}>
              <ProductCard product={item} compact onPress={() => openProduct(item.id)} onAdd={(q) => addProduct(item, q)} />
            </View>
          )}
        />

        {/* Popular packages */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Packages</Text>
          <Pressable onPress={() => navigation.navigate('Build Package')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={popularPackages}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          renderItem={({ item }) => (
            <PackageCard pkg={item} horizontal onAdd={() => addPackage(item)} onPress={() => navigation.navigate('Build Package')} />
          )}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 14, paddingHorizontal: 14, height: 48, borderRadius: 14, borderWidth: 1, gap: 8 },
  searchText: { fontSize: 14 },
  welcomeWrap: { paddingHorizontal: 16, marginTop: 18 },
  hello: { fontSize: 14, fontWeight: '600' },
  welcome: { fontSize: 20, fontWeight: '900', marginTop: 3 },
  banner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 18, overflow: 'hidden' },
  bannerTag: { color: '#fff', fontSize: 11, fontWeight: '800', opacity: 0.9, letterSpacing: 1 },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 6, lineHeight: 25 },
  bannerBtn: { backgroundColor: '#fff', alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8, marginTop: 12 },
  bannerBtnText: { fontWeight: '800', fontSize: 13 },
  section: { paddingHorizontal: 16, marginTop: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 22, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '900' },
  seeAll: { fontSize: 13, fontWeight: '700' },
});
export default HomeScreen;

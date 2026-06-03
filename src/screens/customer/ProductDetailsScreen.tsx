import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import ProductImage from '../../components/ProductImage';
import QuantitySelector from '../../components/QuantitySelector';
import Button from '../../components/Button';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';

const ProductDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { products } = useData();
  const { addProduct } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === route.params?.id);
  const styles = makeStyles(colors);

  if (!product) {
    return (
      <View style={styles.root}>
        <Header title="Product" showBack onBack={() => navigation.goBack()} />
        <View style={styles.missing}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.missingText}>Product not found.</Text>
        </View>
      </View>
    );
  }

  const handleAdd = () => {
    addProduct(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <View style={styles.root}>
      <Header title="Product Details" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProductImage uri={product.image} type={product.type} height={240} radius={20} iconSize={84} />

        <View style={styles.headerRow}>
          <View style={[styles.typePill, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name={product.type === 'Fruit' ? 'nutrition' : 'leaf'} size={13} color={colors.primaryDark} />
            <Text style={[styles.typeText, { color: colors.primaryDark }]}>{product.type}</Text>
          </View>
          {product.category ? <Text style={styles.category}>{product.category}</Text> : null}
        </View>

        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primaryDark }]}>{formatPrice(product.price)}</Text>
          <Text style={styles.unit}>/ {product.unit}</Text>
        </View>

        <View style={styles.stockRow}>
          <Ionicons
            name={product.inStock ? 'checkmark-circle' : 'close-circle'}
            size={18}
            color={product.inStock ? colors.success : colors.danger}
          />
          <Text style={[styles.stockText, { color: product.inStock ? colors.success : colors.danger }]}>
            {product.inStock ? `In stock (${product.stock} ${product.unit} available)` : 'Out of stock'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        {product.inStock && (
          <>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.qtyRow}>
              <QuantitySelector value={qty} onChange={setQty} />
              <Text style={styles.lineTotal}>Total: {formatPrice(product.price * qty)}</Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Button
          title={added ? 'Added to Cart ✓' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          icon={added ? undefined : 'cart-outline'}
          variant={added ? 'outline' : 'primary'}
          disabled={!product.inStock}
          onPress={handleAdd}
        />
      </View>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    content: { padding: 16, paddingBottom: 32 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
    typePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    typeText: { fontSize: 12, fontWeight: '700' },
    category: { color: c.textMuted, fontSize: 13, fontWeight: '500' },
    name: { fontSize: 26, fontWeight: '800', color: c.text, marginTop: 10 },
    priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 8 },
    price: { fontSize: 24, fontWeight: '800' },
    unit: { fontSize: 15, color: c.textMuted, marginBottom: 2 },
    stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
    stockText: { fontSize: 14, fontWeight: '600' },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: c.text, marginTop: 22, marginBottom: 8 },
    description: { fontSize: 15, color: c.textMuted, lineHeight: 22 },
    qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    lineTotal: { fontSize: 15, fontWeight: '700', color: c.text },
    footer: { padding: 16, borderTopWidth: 1 },
    missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    missingText: { color: c.textMuted, fontSize: 15 },
  });

export default ProductDetailsScreen;

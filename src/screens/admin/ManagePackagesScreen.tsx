import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import ProductImage from '../../components/ProductImage';
import Button from '../../components/Button';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { ProductPackage } from '../../types';
import { formatPrice } from '../../utils/currency';

const ManagePackagesScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { packages, deletePackage } = useData();
  const styles = makeStyles(colors);

  const confirmDelete = (p: ProductPackage) => {
    if (Platform.OS === 'web') { deletePackage(p.id); return; }
    Alert.alert('Delete package', `Remove "${p.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePackage(p.id) },
    ]);
  };

  return (
    <View style={styles.root}>
      <Header title="Manage Packages" showCart={false} />
      <View style={styles.topBar}>
        <Text style={styles.count}>{packages.length} package{packages.length === 1 ? '' : 's'}</Text>
        <Button title="Add" icon="add" size="sm" fullWidth={false} onPress={() => navigation.navigate('AddEditPackage', {})} />
      </View>
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ProductImage uri={item.image} type="Vegetable" height={64} radius={12} iconSize={26} style={{ width: 64 }} />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.meta} numberOfLines={1}>{item.size} · {item.items.length} items</Text>
              <Text style={[styles.price, { color: colors.primaryDark }]}>{formatPrice(item.price)}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable style={[styles.iconBtn, { backgroundColor: colors.primarySoft }]} onPress={() => navigation.navigate('AddEditPackage', { pkg: item })}>
                <Ionicons name="create-outline" size={18} color={colors.primaryDark} />
              </Pressable>
              <Pressable style={[styles.iconBtn, { backgroundColor: '#FDECEC' }]} onPress={() => confirmDelete(item)}>
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No packages yet.</Text>}
      />
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12 },
    count: { fontSize: 14, fontWeight: '700', color: c.textMuted },
    list: { padding: 16, gap: 12, paddingBottom: 40 },
    card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 10 },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: '700', color: c.text },
    meta: { fontSize: 12, color: c.textMuted, marginTop: 2 },
    price: { fontSize: 14, fontWeight: '800', marginTop: 4 },
    actions: { gap: 8 },
    iconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    empty: { textAlign: 'center', color: c.textMuted, marginTop: 40, fontSize: 15 },
  });

export default ManagePackagesScreen;

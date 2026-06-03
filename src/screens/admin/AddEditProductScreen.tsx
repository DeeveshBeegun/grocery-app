import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import ProductForm from '../../components/ProductForm';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { Product } from '../../types';

const AddEditProductScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addProduct, updateProduct } = useData();
  const editing: Product | undefined = route.params?.product;

  const leave = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Manage Products');
  };

  const handleSave = (p: Product) => {
    if (editing) updateProduct(p);
    else addProduct(p);
    leave();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <Header title={editing ? 'Edit Product' : 'Add Product'} showBack onBack={leave} showCart={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <ProductForm initial={editing} onSave={handleSave} onCancel={leave} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
});

export default AddEditProductScreen;

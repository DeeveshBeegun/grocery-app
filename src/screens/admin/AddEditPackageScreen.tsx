import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import PackageForm from '../../components/PackageForm';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { ProductPackage } from '../../types';

const AddEditPackageScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { products, addPackage, updatePackage } = useData();
  const editing: ProductPackage | undefined = route.params?.pkg;

  const handleSave = (p: ProductPackage) => {
    if (editing) updatePackage(p);
    else addPackage(p);
    navigation.goBack();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <Header title={editing ? 'Edit Package' : 'Add Package'} showBack onBack={() => navigation.goBack()} showCart={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <PackageForm initial={editing} products={products} onSave={handleSave} onCancel={() => navigation.goBack()} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
});

export default AddEditPackageScreen;

import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { Category } from '../types';

interface Props { category: Category; onPress?: () => void; }
const CategoryCard: React.FC<Props> = ({ category, onPress }) => {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border }, pressed && { opacity: 0.8 }]}>
      <Ionicons name={category.icon as any} size={26} color={colors.primary} />
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{category.name}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  card: { width: 104, height: 96, borderRadius: 16, borderWidth: 1, padding: 12, marginRight: 12, justifyContent: 'space-between',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  name: { fontSize: 13, fontWeight: '700' },
});
export default CategoryCard;

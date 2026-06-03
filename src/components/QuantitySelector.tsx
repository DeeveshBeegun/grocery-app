import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  size?: 'sm' | 'md';
}
const QuantitySelector: React.FC<Props> = ({ value, onChange, min = 1, size = 'md' }) => {
  const { colors } = useTheme();
  const dim = size === 'sm' ? 28 : 34;
  const icon = size === 'sm' ? 15 : 18;
  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        style={[styles.btn, { width: dim, height: dim, backgroundColor: colors.surface }]}
      >
        <Ionicons name="remove" size={icon} color={colors.text} />
      </Pressable>
      <Text style={[styles.value, { color: colors.text, minWidth: dim }]}>{value}</Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        style={[styles.btn, { width: dim, height: dim, backgroundColor: colors.primary }]}
      >
        <Ionicons name="add" size={icon} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 3, alignSelf: 'flex-start' },
  btn: { borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  value: { textAlign: 'center', fontWeight: '800', fontSize: 15 },
});
export default QuantitySelector;

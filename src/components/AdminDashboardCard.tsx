import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  label: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  tint?: string;
}
const AdminDashboardCard: React.FC<Props> = ({ label, value, icon, tint }) => {
  const { colors } = useTheme();
  const c = tint ?? colors.primary;
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.icon, { backgroundColor: c + '22' }]}>
        <Ionicons name={icon} size={20} color={c} />
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 140, borderRadius: 16, borderWidth: 1, padding: 14, margin: 6,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 26, fontWeight: '900', marginTop: 10 },
  label: { fontSize: 13, marginTop: 2, fontWeight: '600' },
});
export default AdminDashboardCard;

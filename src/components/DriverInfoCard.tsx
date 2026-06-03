import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

interface Props { name: string; phone: string; }
const DriverInfoCard: React.FC<Props> = ({ name, phone }) => {
  const { colors } = useTheme();
  const call = () => {
    if (Platform.OS !== 'web') Linking.openURL(`tel:${phone}`).catch(() => {});
  };
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name="person" size={24} color={colors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.role, { color: colors.textMuted }]}>Your delivery person</Text>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.phone, { color: colors.textMuted }]}>{phone}</Text>
      </View>
      <Pressable onPress={call} style={[styles.callBtn, { backgroundColor: colors.primary }]}>
        <Ionicons name="call" size={20} color="#fff" />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, padding: 14 },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  role: { fontSize: 12 },
  name: { fontSize: 16, fontWeight: '800', marginTop: 1 },
  phone: { fontSize: 13, marginTop: 1 },
  callBtn: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
});
export default DriverInfoCard;

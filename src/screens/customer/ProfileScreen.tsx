import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [addresses, setAddresses] = useState<string[]>(user?.addresses ?? []);

  const styles = makeStyles(colors);

  const save = () => {
    updateProfile({ name, email, phone, addresses: addresses.filter((a) => a.trim()) });
    setEditing(false);
  };

  const updateAddress = (i: number, val: string) => setAddresses((prev) => prev.map((a, idx) => (idx === i ? val : a)));
  const addAddress = () => setAddresses((prev) => [...prev, '']);
  const removeAddress = (i: number) => setAddresses((prev) => prev.filter((_, idx) => idx !== i));

  const initials = (user?.name ?? 'U').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <View style={styles.root}>
      <Header title="Profile" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.onPrimary }]}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <View style={[styles.rolePill, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="person-circle-outline" size={14} color={colors.primaryDark} />
            <Text style={[styles.roleText, { color: colors.primaryDark }]}>Customer</Text>
          </View>
        </View>

        {editing ? (
          <View style={styles.card}>
            <InputField label="Full name" icon="person-outline" value={name} onChangeText={setName} />
            <InputField label="Email" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <InputField label="Phone" icon="call-outline" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

            <Text style={styles.subLabel}>Saved addresses</Text>
            {addresses.map((a, i) => (
              <View key={i} style={styles.addrEditRow}>
                <View style={{ flex: 1 }}>
                  <InputField icon="location-outline" value={a} onChangeText={(v) => updateAddress(i, v)} placeholder="Address" containerStyle={{ marginBottom: 0 }} />
                </View>
                <Pressable onPress={() => removeAddress(i)} style={styles.removeAddr}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </Pressable>
              </View>
            ))}
            <Pressable onPress={addAddress} style={styles.addAddr}>
              <Ionicons name="add-circle-outline" size={18} color={colors.primaryDark} />
              <Text style={[styles.addAddrText, { color: colors.primaryDark }]}>Add address</Text>
            </Pressable>

            <Button title="Save Changes" icon="checkmark" onPress={save} style={{ marginTop: 16 }} />
            <Button title="Cancel" variant="ghost" onPress={() => setEditing(false)} style={{ marginTop: 4 }} />
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <InfoRow icon="mail-outline" label="Email" value={user?.email ?? '-'} colors={colors} />
              <View style={styles.divider} />
              <InfoRow icon="call-outline" label="Phone" value={user?.phone ?? '-'} colors={colors} />
            </View>

            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            <View style={styles.card}>
              {(user?.addresses ?? []).length === 0 ? (
                <Text style={styles.muted}>No saved addresses.</Text>
              ) : (
                user!.addresses.map((a, i) => (
                  <View key={i}>
                    {i > 0 && <View style={styles.divider} />}
                    <View style={styles.addrRow}>
                      <Ionicons name="location-outline" size={18} color={colors.primary} />
                      <Text style={styles.addrText}>{a}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            <Button title="Edit Profile" icon="create-outline" variant="outline" onPress={() => setEditing(true)} style={{ marginTop: 18 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ icon, label, value, colors }: { icon: any; label: string; value: string; colors: any }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 }}>
    <View style={{ width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft }}>
      <Ionicons name={icon} size={18} color={colors.primaryDark} />
    </View>
    <View>
      <Text style={{ fontSize: 12, color: colors.textMuted }}>{label}</Text>
      <Text style={{ fontSize: 15, color: colors.text, fontWeight: '600', marginTop: 1 }}>{value}</Text>
    </View>
  </View>
);

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    content: { padding: 16, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 20 },
    avatar: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 32, fontWeight: '800' },
    name: { fontSize: 22, fontWeight: '800', color: c.text, marginTop: 12 },
    rolePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 8 },
    roleText: { fontSize: 12, fontWeight: '700' },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 16, marginBottom: 4 },
    divider: { height: 1, backgroundColor: c.border, marginVertical: 10 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: c.text, marginTop: 20, marginBottom: 10 },
    addrRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
    addrText: { fontSize: 15, color: c.text, flex: 1 },
    muted: { color: c.textMuted, fontSize: 14 },
    subLabel: { fontSize: 14, fontWeight: '700', color: c.text, marginTop: 8, marginBottom: 8 },
    addrEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    removeAddr: { padding: 8 },
    addAddr: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
    addAddrText: { fontSize: 14, fontWeight: '700' },
  });

export default ProfileScreen;

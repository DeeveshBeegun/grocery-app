import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

const REPORTS: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Sales Report', icon: 'document-text-outline' },
  { label: 'Inventory Report', icon: 'cube-outline' },
  { label: 'Orders Report', icon: 'receipt-outline' },
  { label: 'Customer Report', icon: 'people-outline' },
];

// Mock report export actions — shows a confirmation only (no real PDF).
const ExportReportButtons: React.FC = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const onExport = (label: string) => {
    const msg = `Your ${label} (PDF) is being prepared. This is a mock export — no file is generated.`;
    if (Platform.OS === 'web') {
      // Alert.alert has no web implementation in RN; fall back to console + window.
      // eslint-disable-next-line no-alert
      (globalThis as any)?.alert?.(msg);
    } else {
      Alert.alert(`Export ${label}`, msg);
    }
  };

  return (
    <View style={styles.grid}>
      {REPORTS.map((r) => (
        <Pressable
          key={r.label}
          onPress={() => onExport(r.label)}
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.7 }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name={r.icon} size={18} color={colors.primaryDark} />
          </View>
          <Text style={styles.label} numberOfLines={1}>{r.label}</Text>
          <Ionicons name="download-outline" size={16} color={colors.textMuted} />
        </Pressable>
      ))}
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    btn: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '47%', flexGrow: 1, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 12 },
    iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    label: { flex: 1, fontSize: 13, fontWeight: '700', color: c.text },
  });

export default ExportReportButtons;

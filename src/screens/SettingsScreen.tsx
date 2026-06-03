import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import ColorPickerSetting from '../components/ColorPickerSetting';
import { useTheme } from '../theme/ThemeContext';

const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.root}>
      <Header title="Settings" showCart={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}>
          <View style={[styles.introIcon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="color-palette-outline" size={24} color={colors.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Appearance</Text>
            <Text style={styles.subtitle}>Personalise the app with your favourite colour. Your choice is saved on this device.</Text>
          </View>
        </View>

        <ColorPickerSetting />

        <Text style={styles.note}>
          The selected colour updates buttons, header accents, the active menu item and highlights across the whole app.
        </Text>
      </ScrollView>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    content: { padding: 16, paddingBottom: 40 },
    intro: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    introIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 20, fontWeight: '800', color: c.text },
    subtitle: { fontSize: 13, color: c.textMuted, marginTop: 2, lineHeight: 19 },
    note: { fontSize: 13, color: c.textMuted, marginTop: 20, lineHeight: 19, textAlign: 'center' },
  });

export default SettingsScreen;

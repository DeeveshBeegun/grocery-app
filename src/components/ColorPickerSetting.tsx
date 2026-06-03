import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, DEFAULT_COLOR, isValidHex, normalizeHex } from '../theme/ThemeContext';
import Button from './Button';

// --- color math (HSV <-> hex) ---
const hsvToHex = (h: number, s: number, v: number) => {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return ('#' + to(r) + to(g) + to(b)).toUpperCase();
};

const PRESETS = ['#2E7D32', '#1B5E20', '#00897B', '#0277BD', '#3949AB', '#6A1B9A', '#C62828', '#EF6C00', '#F9A825', '#5D4037'];
const HUES = [0, 30, 60, 120, 160, 190, 220, 260, 290, 330];

const ColorPickerSetting: React.FC = () => {
  const { colors, primaryColor, setPrimaryColor, resetColor } = useTheme();
  const [draft, setDraft] = useState(primaryColor);
  const [hexText, setHexText] = useState(primaryColor);
  const [hue, setHue] = useState(120);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    setDraft(primaryColor);
    setHexText(primaryColor);
  }, [primaryColor]);

  const applyHex = (text: string) => {
    setHexText(text);
    if (isValidHex(text)) setDraft(normalizeHex(text));
  };

  const pickHue = (h: number) => {
    setHue(h);
    const hex = hsvToHex(h, 0.75, 0.7);
    setDraft(hex);
    setHexText(hex);
  };

  const onBarLayout = (e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width);

  // Saturation/brightness strip derived from current hue
  const shades = [0.95, 0.8, 0.65, 0.5, 0.35].map((v, i) => hsvToHex(hue, 0.4 + i * 0.14, v));

  return (
    <View>
      {/* live preview */}
      <View style={[styles.preview, { backgroundColor: draft }]}>
        <Text style={styles.previewLabel}>Live Preview</Text>
        <Text style={styles.previewHex}>{draft}</Text>
        <View style={styles.previewRow}>
          <View style={styles.previewBtn}><Text style={[styles.previewBtnText, { color: draft }]}>Sample Button</Text></View>
          <Ionicons name="heart" size={20} color="#fff" />
          <Ionicons name="cart" size={20} color="#fff" />
        </View>
      </View>

      {/* hue wheel (row of hues) */}
      <Text style={[styles.section, { color: colors.text }]}>Pick a hue</Text>
      <View style={styles.hueRow} onLayout={onBarLayout}>
        {HUES.map((h) => (
          <Pressable key={h} onPress={() => pickHue(h)} style={[styles.hueDot, { backgroundColor: hsvToHex(h, 0.8, 0.85) }]}>
            {Math.abs(h - hue) < 1 && <Ionicons name="checkmark" size={14} color="#fff" />}
          </Pressable>
        ))}
      </View>

      {/* shade strip for chosen hue */}
      <Text style={[styles.section, { color: colors.text }]}>Adjust shade</Text>
      <View style={styles.shadeRow}>
        {shades.map((s) => (
          <Pressable key={s} onPress={() => { setDraft(s); setHexText(s); }} style={[styles.shade, { backgroundColor: s, borderColor: draft === s ? colors.text : 'transparent' }]} />
        ))}
      </View>

      {/* preset palette */}
      <Text style={[styles.section, { color: colors.text }]}>Preset colors</Text>
      <View style={styles.presetWrap}>
        {PRESETS.map((p) => (
          <Pressable key={p} onPress={() => { setDraft(p); setHexText(p); }} style={[styles.preset, { backgroundColor: p, borderColor: draft.toUpperCase() === p ? colors.text : colors.border }]}>
            {draft.toUpperCase() === p && <Ionicons name="checkmark" size={16} color="#fff" />}
          </Pressable>
        ))}
      </View>

      {/* hex input */}
      <Text style={[styles.section, { color: colors.text }]}>Hex value</Text>
      <View style={[styles.hexField, { borderColor: isValidHex(hexText) ? colors.border : colors.danger, backgroundColor: colors.surface }]}>
        <View style={[styles.swatch, { backgroundColor: isValidHex(hexText) ? normalizeHex(hexText) : colors.border }]} />
        <TextInput
          value={hexText}
          onChangeText={applyHex}
          placeholder="#2E7D32"
          autoCapitalize="characters"
          placeholderTextColor={colors.textMuted}
          style={[styles.hexInput, { color: colors.text }]}
          maxLength={7}
        />
      </View>

      <View style={{ flexDirection: 'row', marginTop: 16, gap: 10 }}>
        <Button title="Reset to Default" variant="outline" icon="refresh" onPress={() => { resetColor(); setDraft(DEFAULT_COLOR); setHexText(DEFAULT_COLOR); }} style={{ flex: 1 }} />
        <Button title="Save Color" icon="checkmark-circle" onPress={() => setPrimaryColor(draft)} style={{ flex: 1 }} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  preview: { borderRadius: 18, padding: 18, alignItems: 'center', marginBottom: 6 },
  previewLabel: { color: '#fff', fontSize: 12, opacity: 0.85, fontWeight: '600' },
  previewHex: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 2, letterSpacing: 1 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 },
  previewBtn: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  previewBtnText: { fontWeight: '800', fontSize: 13 },
  section: { fontSize: 14, fontWeight: '800', marginTop: 18, marginBottom: 10 },
  hueRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  hueDot: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  shadeRow: { flexDirection: 'row', gap: 8 },
  shade: { flex: 1, height: 44, borderRadius: 12, borderWidth: 2 },
  presetWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  preset: { width: 40, height: 40, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  hexField: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, height: 50 },
  swatch: { width: 30, height: 30, borderRadius: 8, marginRight: 10 },
  hexInput: { flex: 1, fontSize: 16, fontWeight: '700' },
});
export default ColorPickerSetting;

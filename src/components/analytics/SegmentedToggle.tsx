import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface Props<T extends string> {
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}

// Compact pill toggle used to switch chart granularity (daily/weekly/...).
function SegmentedToggle<T extends string>({ options, value, onChange }: Props<T>) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.wrap}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.item, active && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.label, { color: active ? colors.onPrimary : colors.textMuted }]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    wrap: { flexDirection: 'row', backgroundColor: c.surface, borderRadius: 10, padding: 3, gap: 2 },
    item: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
    label: { fontSize: 11.5, fontWeight: '700' },
  });

export default SegmentedToggle;

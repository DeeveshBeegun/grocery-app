import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { RANGE_OPTIONS, RangeKey } from '../../data/analyticsData';

interface Props {
  value: RangeKey;
  onChange: (key: RangeKey) => void;
}

// Horizontal scroll of date-range chips that drive every chart and KPI card.
const DashboardFilterBar: React.FC<Props> = ({ value, onChange }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {RANGE_OPTIONS.map((opt) => {
        const active = opt.key === value;
        const isCustom = opt.key === 'custom';
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[
              styles.chip,
              { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.card },
            ]}
          >
            {isCustom ? (
              <Ionicons
                name="calendar-outline"
                size={13}
                color={active ? colors.onPrimary : colors.textMuted}
                style={{ marginRight: 5 }}
              />
            ) : null}
            <Text style={[styles.chipText, { color: active ? colors.onPrimary : colors.text }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    row: { gap: 8, paddingVertical: 2, paddingRight: 8 },
    chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
    chipText: { fontSize: 13, fontWeight: '700' },
  });

export default DashboardFilterBar;

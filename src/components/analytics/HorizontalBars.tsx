import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { CHART_PALETTE } from '../../data/analyticsData';

export interface BarDatum {
  label: string;
  value: number;
  valueLabel?: string;
  color?: string;
}

interface Props {
  data: BarDatum[];
  maxItems?: number;
}

// Ranked horizontal bar list — used for "Top 10 best sellers" and package
// popularity, where react-native-chart-kit has no horizontal bar option.
const HorizontalBars: React.FC<Props> = ({ data, maxItems = 10 }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const items = data.slice(0, maxItems);
  const max = Math.max(...items.map((d) => d.value), 1);

  return (
    <View style={{ gap: 12 }}>
      {items.map((d, i) => {
        const pct = Math.max(0.06, d.value / max);
        const color = d.color ?? CHART_PALETTE[i % CHART_PALETTE.length];
        return (
          <View key={d.label} style={styles.row}>
            <Text style={styles.rank}>{i + 1}</Text>
            <View style={styles.barCol}>
              <View style={styles.labelRow}>
                <Text style={styles.label} numberOfLines={1}>{d.label}</Text>
                <Text style={styles.value}>{d.valueLabel ?? d.value}</Text>
              </View>
              <View style={[styles.track, { backgroundColor: colors.surface }]}>
                <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    rank: { width: 18, textAlign: 'center', fontSize: 12, fontWeight: '800', color: c.textMuted },
    barCol: { flex: 1, gap: 5 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    label: { fontSize: 13, fontWeight: '600', color: c.text, flex: 1, marginRight: 8 },
    value: { fontSize: 12.5, fontWeight: '800', color: c.text },
    track: { height: 9, borderRadius: 6, overflow: 'hidden' },
    fill: { height: 9, borderRadius: 6 },
  });

export default HorizontalBars;

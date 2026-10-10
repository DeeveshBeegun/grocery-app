import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  unit?: string; // appended to legend value, e.g. '%'
}

// Custom SVG doughnut (also used wherever the spec asks for a pie chart) with a
// centre label and a side legend. Avoids chart-kit PieChart layout quirks.
const DonutChart: React.FC<Props> = ({
  data,
  size = 150,
  thickness = 24,
  centerLabel,
  centerValue,
  unit,
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <View style={styles.row}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={colors.border}
              strokeWidth={thickness}
              fill="none"
            />
            {data.map((d) => {
              const frac = d.value / total;
              const dash = frac * c;
              const seg = (
                <Circle
                  key={d.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke={d.color}
                  strokeWidth={thickness}
                  fill="none"
                  strokeDasharray={`${dash} ${c - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              );
              offset += dash;
              return seg;
            })}
          </G>
        </Svg>
        {(centerValue || centerLabel) && (
          <View style={styles.center} pointerEvents="none">
            {centerValue ? <Text style={styles.centerValue}>{centerValue}</Text> : null}
            {centerLabel ? <Text style={styles.centerLabel}>{centerLabel}</Text> : null}
          </View>
        )}
      </View>

      <View style={styles.legend}>
        {data.map((d) => {
          const pct = Math.round((d.value / total) * 100);
          return (
            <View key={d.label} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: d.color }]} />
              <Text style={styles.legendLabel} numberOfLines={1}>{d.label}</Text>
              <Text style={styles.legendValue}>
                {unit ? `${d.value}${unit}` : `${pct}%`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
    centerValue: { fontSize: 18, fontWeight: '900', color: c.text },
    centerLabel: { fontSize: 11, color: c.textMuted, marginTop: 1 },
    legend: { flex: 1, gap: 9 },
    legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dot: { width: 11, height: 11, borderRadius: 4 },
    legendLabel: { flex: 1, fontSize: 13, color: c.text, fontWeight: '600' },
    legendValue: { fontSize: 13, color: c.textMuted, fontWeight: '700' },
  });

export default DonutChart;

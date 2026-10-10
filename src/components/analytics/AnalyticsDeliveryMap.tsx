import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Path, Defs, Pattern, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useChartWidth, hexToRgba } from './chartConfig';
import ChartCard from './ChartCard';

interface Marker {
  id: string;
  kind: 'driver' | 'customer';
  x: number;
  y: number;
  label: string;
}

interface Props {
  markers: Marker[];
}

// Placeholder "live map" showing driver and customer markers with route hints.
// Purely a mock visual (no real map SDK) so it works on web, iOS and Android.
const AnalyticsDeliveryMap: React.FC<Props> = ({ markers }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const width = useChartWidth(60);
  const height = 220;

  const drivers = markers.filter((m) => m.kind === 'driver');
  const customers = markers.filter((m) => m.kind === 'customer');
  // Pair drivers to customers for route placeholders.
  const routes = drivers.map((d, i) => ({ d, c: customers[i % customers.length] }));

  return (
    <ChartCard title="Active Delivery Map" padded={false}>
      <View style={{ paddingHorizontal: 14, paddingTop: 14 }}>
        <Text style={styles.caption}>{drivers.length} drivers · {customers.length} active orders</Text>
      </View>
      <View style={styles.mapWrap}>
        <Svg width={width} height={height}>
          <Defs>
            <Pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <Rect width="28" height="28" fill={colors.surface} />
              <Path d="M28 0 L0 0 0 28" fill="none" stroke={colors.border} strokeWidth={1} />
            </Pattern>
          </Defs>
          <Rect width={width} height={height} fill="url(#grid)" rx={0} />

          {/* route placeholders */}
          {routes.map(({ d, c }, i) => (
            <Line
              key={`r${i}`}
              x1={d.x * width}
              y1={d.y * height}
              x2={c.x * width}
              y2={c.y * height}
              stroke={hexToRgba(colors.primary, 0.5)}
              strokeWidth={2}
              strokeDasharray="6 6"
            />
          ))}

          {/* customer markers */}
          {customers.map((m) => (
            <Circle key={m.id} cx={m.x * width} cy={m.y * height} r={7} fill={colors.card} stroke={colors.danger} strokeWidth={3} />
          ))}
          {/* driver markers */}
          {drivers.map((m) => (
            <Circle key={m.id} cx={m.x * width} cy={m.y * height} r={9} fill={colors.primary} stroke={colors.card} strokeWidth={2.5} />
          ))}
        </Svg>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Drivers</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.ring, { borderColor: colors.danger }]} />
          <Text style={styles.legendText}>Customers</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="git-network-outline" size={13} color={colors.textMuted} />
          <Text style={styles.legendText}>Routes</Text>
        </View>
      </View>
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    caption: { fontSize: 12, color: c.textMuted, fontWeight: '600', marginBottom: 10 },
    mapWrap: { overflow: 'hidden' },
    legend: { flexDirection: 'row', gap: 18, padding: 14 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 12, height: 12, borderRadius: 6 },
    ring: { width: 12, height: 12, borderRadius: 6, borderWidth: 3 },
    legendText: { fontSize: 12, color: c.textMuted, fontWeight: '600' },
  });

export default AnalyticsDeliveryMap;

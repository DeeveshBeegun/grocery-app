import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Analytics } from '../../data/analyticsData';
import ChartCard from './ChartCard';
import DonutChart from './DonutChart';

interface Props {
  delivery: Analytics['delivery'];
}

// Delivery status breakdown doughnut plus key performance metrics.
const DeliveryAnalyticsChart: React.FC<Props> = ({ delivery }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const metrics = [
    { label: 'Avg delivery time', value: delivery.avgTime, icon: 'time-outline' as const, tint: colors.info },
    { label: 'Fastest delivery', value: delivery.fastest, icon: 'flash-outline' as const, tint: colors.success },
    { label: 'Delayed deliveries', value: String(delivery.delayed), icon: 'warning-outline' as const, tint: colors.warning },
    { label: 'On-time rate', value: `${delivery.onTimePct}%`, icon: 'checkmark-circle-outline' as const, tint: colors.success },
  ];

  return (
    <ChartCard title="Delivery Status">
      <DonutChart
        data={delivery.statusBreakdown}
        centerValue={`${delivery.statusBreakdown.reduce((a, d) => a + d.value, 0)}`}
        centerLabel="orders"
      />
      <View style={styles.grid}>
        {metrics.map((m) => (
          <View key={m.label} style={styles.metric}>
            <View style={[styles.icon, { backgroundColor: m.tint + '18' }]}>
              <Ionicons name={m.icon} size={15} color={m.tint} />
            </View>
            <View>
              <Text style={styles.value}>{m.value}</Text>
              <Text style={styles.label}>{m.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
    metric: { flexDirection: 'row', alignItems: 'center', gap: 9, width: '47%', flexGrow: 1, backgroundColor: c.surface, borderRadius: 12, padding: 10 },
    icon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    value: { fontSize: 15, fontWeight: '900', color: c.text },
    label: { fontSize: 11, color: c.textMuted, fontWeight: '600' },
  });

export default DeliveryAnalyticsChart;

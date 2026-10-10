import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme/ThemeContext';
import { Analytics, money } from '../../data/analyticsData';
import { buildChartConfig, useChartWidth, hexToRgba } from './chartConfig';
import ChartCard from './ChartCard';

interface Props {
  forecast: Analytics['forecast'];
}

// Sales forecast: actual history continued by a projected trend line, plus
// headline projection chips.
const ForecastChart: React.FC<Props> = ({ forecast }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const width = useChartWidth(60);

  // Build one continuous series (actuals then projections) for the chart line.
  const actual = forecast.actual.filter((v): v is number => v != null);
  const projected = forecast.projected.filter((v): v is number => v != null);
  const combined = [...actual, ...projected.slice(1)];

  const chips = [
    { label: 'Next Week Revenue', value: money(forecast.nextWeekRevenue), icon: 'trending-up-outline' as const },
    { label: 'Next Month Revenue', value: money(forecast.nextMonthRevenue), icon: 'cash-outline' as const },
    { label: 'Next Month Orders', value: String(forecast.nextMonthOrders), icon: 'receipt-outline' as const },
  ];

  return (
    <ChartCard title="Sales Forecast">
      <LineChart
        data={{
          labels: forecast.labels,
          datasets: [
            { data: combined, color: (o = 1) => hexToRgba(colors.primary, o), strokeWidth: 3 },
          ],
        }}
        width={width}
        height={200}
        chartConfig={{ ...buildChartConfig(colors), formatYLabel: (v: string) => `${Math.round(Number(v) / 1000)}k` }}
        bezier
        fromZero
        withInnerLines
        yAxisLabel="Rs "
        style={{ paddingRight: 6 }}
      />
      <View style={styles.note}>
        <Ionicons name="sparkles-outline" size={13} color={colors.primaryDark} />
        <Text style={styles.noteText}>Projection based on the last 6 months of mock trend data.</Text>
      </View>
      <View style={styles.chips}>
        {chips.map((c) => (
          <View key={c.label} style={styles.chip}>
            <Ionicons name={c.icon} size={16} color={colors.primaryDark} />
            <Text style={styles.chipValue}>{c.value}</Text>
            <Text style={styles.chipLabel}>{c.label}</Text>
          </View>
        ))}
      </View>
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    note: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
    noteText: { fontSize: 11.5, color: c.textMuted, flex: 1 },
    chips: { flexDirection: 'row', gap: 8, marginTop: 12 },
    chip: { flex: 1, backgroundColor: c.surface, borderRadius: 12, padding: 10, gap: 2 },
    chipValue: { fontSize: 15, fontWeight: '900', color: c.text, marginTop: 4 },
    chipLabel: { fontSize: 10.5, color: c.textMuted, fontWeight: '600' },
  });

export default ForecastChart;

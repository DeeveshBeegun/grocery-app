import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme/ThemeContext';
import { CategoryPerf, money } from '../../data/analyticsData';
import { buildChartConfig, useChartWidth } from './chartConfig';
import ChartCard from './ChartCard';

interface Props {
  data: CategoryPerf[];
}

const SHORT: Record<string, string> = {
  'Fresh Vegetables': 'Veg',
  'Fresh Fruits': 'Fruit',
  'Leafy Greens': 'Leafy',
  'Root Vegetables': 'Root',
  'Organic Picks': 'Organic',
  Packages: 'Pkg',
};

// Category revenue bar chart plus a per-category breakdown list with growth.
const CategoryPerformanceChart: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const width = useChartWidth(60);

  return (
    <ChartCard title="Revenue by Category">
      <BarChart
        data={{
          labels: data.map((d) => SHORT[d.name] ?? d.name),
          datasets: [{ data: data.map((d) => d.revenue) }],
        }}
        width={width}
        height={200}
        chartConfig={buildChartConfig(colors)}
        fromZero
        showValuesOnTopOfBars={false}
        withInnerLines
        yAxisLabel="Rs "
        yAxisSuffix=""
        style={{ marginLeft: -8 }}
      />
      <View style={styles.list}>
        {data.map((d) => {
          const up = d.growth >= 0;
          return (
            <View key={d.name} style={styles.row}>
              <Text style={styles.name} numberOfLines={1}>{d.name}</Text>
              <Text style={styles.orders}>{d.orders} orders</Text>
              <Text style={styles.revenue}>{money(d.revenue)}</Text>
              <View style={styles.growth}>
                <Ionicons name={up ? 'arrow-up' : 'arrow-down'} size={11} color={up ? colors.success : colors.danger} />
                <Text style={[styles.growthText, { color: up ? colors.success : colors.danger }]}>
                  {Math.abs(d.growth)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    list: { marginTop: 12, gap: 2 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderTopWidth: 1, borderTopColor: c.border, gap: 8 },
    name: { flex: 1, fontSize: 13, fontWeight: '700', color: c.text },
    orders: { fontSize: 12, color: c.textMuted, width: 72, textAlign: 'right' },
    revenue: { fontSize: 13, fontWeight: '800', color: c.text, width: 78, textAlign: 'right' },
    growth: { flexDirection: 'row', alignItems: 'center', gap: 2, width: 52, justifyContent: 'flex-end' },
    growthText: { fontSize: 12, fontWeight: '800' },
  });

export default CategoryPerformanceChart;

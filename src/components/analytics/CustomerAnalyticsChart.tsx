import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme/ThemeContext';
import { buildChartConfig, useChartWidth, hexToRgba } from './chartConfig';
import ChartCard from './ChartCard';

interface Props {
  labels: string[];
  newCustomers: number[];
  returning: number[];
}

// Customer growth: new vs returning customers per month.
const CustomerAnalyticsChart: React.FC<Props> = ({ labels, newCustomers, returning }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const width = useChartWidth(60);

  return (
    <ChartCard title="Customer Growth">
      <View style={styles.legend}>
        <View style={styles.item}>
          <View style={[styles.dot, { backgroundColor: colors.info }]} />
          <Text style={styles.text}>New</Text>
        </View>
        <View style={styles.item}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={styles.text}>Returning</Text>
        </View>
      </View>
      <LineChart
        data={{
          labels,
          datasets: [
            { data: newCustomers, color: (o = 1) => hexToRgba(colors.info, o), strokeWidth: 3 },
            { data: returning, color: (o = 1) => hexToRgba(colors.primary, o), strokeWidth: 3 },
          ],
        }}
        width={width}
        height={200}
        chartConfig={buildChartConfig(colors)}
        bezier
        fromZero
        withInnerLines
        style={{ paddingRight: 6 }}
      />
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    legend: { flexDirection: 'row', gap: 18, marginBottom: 4 },
    item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 11, height: 11, borderRadius: 4 },
    text: { fontSize: 12, color: c.textMuted, fontWeight: '600' },
  });

export default CustomerAnalyticsChart;

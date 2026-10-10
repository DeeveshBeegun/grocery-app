import React, { useState } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme/ThemeContext';
import { Granularity } from '../../data/analyticsData';
import { buildChartConfig, useChartWidth, hexToRgba } from './chartConfig';
import ChartCard from './ChartCard';
import SegmentedToggle from './SegmentedToggle';

type Key = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface Props {
  labels: Granularity<string[]>;
  series: Granularity;
}

const compact = (v: string) => {
  const n = Number(v);
  if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}k`;
  return String(Math.round(n));
};

// Revenue trend line chart with daily / weekly / monthly / yearly granularity.
const RevenueChart: React.FC<Props> = ({ labels, series }) => {
  const { colors } = useTheme();
  const [gran, setGran] = useState<Key>('monthly');
  const width = useChartWidth(60);

  return (
    <ChartCard
      title="Revenue Trend"
      padded={false}
      right={
        <SegmentedToggle
          value={gran}
          onChange={setGran}
          options={[
            { key: 'daily', label: 'D' },
            { key: 'weekly', label: 'W' },
            { key: 'monthly', label: 'M' },
            { key: 'yearly', label: 'Y' },
          ]}
        />
      }
    >
      <LineChart
        data={{
          labels: labels[gran],
          datasets: [{ data: series[gran], color: (o = 1) => hexToRgba(colors.primary, o), strokeWidth: 3 }],
        }}
        width={width}
        height={210}
        chartConfig={buildChartConfig(colors)}
        bezier
        fromZero
        withInnerLines
        yAxisLabel="Rs "
        formatYLabel={compact}
        style={{ paddingRight: 6 }}
      />
    </ChartCard>
  );
};

export default RevenueChart;

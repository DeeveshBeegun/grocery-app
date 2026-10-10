import React, { useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme/ThemeContext';
import { buildChartConfig, useChartWidth, hexToRgba } from './chartConfig';
import ChartCard from './ChartCard';
import SegmentedToggle from './SegmentedToggle';

type Key = 'daily' | 'weekly' | 'monthly';

interface Props {
  labels: { daily: string[]; weekly: string[]; monthly: string[] };
  series: { daily: number[]; weekly: number[]; monthly: number[] };
}

// Orders trend line chart (orders per day / week / month).
const OrdersChart: React.FC<Props> = ({ labels, series }) => {
  const { colors } = useTheme();
  const [gran, setGran] = useState<Key>('daily');
  const width = useChartWidth(60);

  return (
    <ChartCard
      title="Orders Trend"
      padded={false}
      right={
        <SegmentedToggle
          value={gran}
          onChange={setGran}
          options={[
            { key: 'daily', label: 'Day' },
            { key: 'weekly', label: 'Week' },
            { key: 'monthly', label: 'Month' },
          ]}
        />
      }
    >
      <LineChart
        data={{
          labels: labels[gran],
          datasets: [{ data: series[gran], color: (o = 1) => hexToRgba(colors.info, o), strokeWidth: 3 }],
        }}
        width={width}
        height={210}
        chartConfig={buildChartConfig(colors, colors.info)}
        bezier
        fromZero
        withInnerLines
        style={{ paddingRight: 6 }}
      />
    </ChartCard>
  );
};

export default OrdersChart;

import React from 'react';
import { TopProduct } from '../../data/analyticsData';
import ChartCard from './ChartCard';
import HorizontalBars from './HorizontalBars';

interface Props {
  data: TopProduct[];
}

// Top 10 best sellers as a horizontal bar chart (units sold).
const ProductPerformanceChart: React.FC<Props> = ({ data }) => (
  <ChartCard title="Top 10 Best Sellers">
    <HorizontalBars
      data={data.map((p) => ({
        label: p.name,
        value: p.unitsSold,
        valueLabel: `${p.unitsSold} ${p.unit}`,
      }))}
      maxItems={10}
    />
  </ChartCard>
);

export default ProductPerformanceChart;

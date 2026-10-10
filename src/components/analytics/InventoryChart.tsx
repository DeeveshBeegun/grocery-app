import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Analytics, money, CHART_PALETTE } from '../../data/analyticsData';
import ChartCard from './ChartCard';
import DonutChart from './DonutChart';

interface Props {
  inventory: Analytics['inventory'];
}

// Stock status doughnut + total inventory value + value by category.
const InventoryChart: React.FC<Props> = ({ inventory }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const status = [
    { label: 'In Stock', value: inventory.inStock, color: colors.success },
    { label: 'Low Stock', value: inventory.lowStock, color: colors.warning },
    { label: 'Out of Stock', value: inventory.outOfStock, color: colors.danger },
  ];
  const totalUnits = inventory.inStock + inventory.lowStock + inventory.outOfStock;
  const maxCat = Math.max(...inventory.byCategory.map((c) => c.value), 1);

  return (
    <ChartCard title="Stock Status Overview">
      <DonutChart data={status} centerValue={`${totalUnits}`} centerLabel="products" unit="" />

      <View style={styles.valueBox}>
        <Text style={styles.valueLabel}>Total inventory value</Text>
        <Text style={styles.valueAmount}>{money(inventory.totalValue)}</Text>
      </View>

      <Text style={styles.subTitle}>Inventory value by category</Text>
      <View style={{ gap: 9 }}>
        {inventory.byCategory.slice(0, 6).map((cat, i) => (
          <View key={cat.name} style={styles.catRow}>
            <Text style={styles.catName} numberOfLines={1}>{cat.name}</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.max(6, (cat.value / maxCat) * 100)}%`, backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length] }]} />
            </View>
            <Text style={styles.catValue}>{money(cat.value)}</Text>
          </View>
        ))}
      </View>
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    valueBox: { marginTop: 16, backgroundColor: c.primarySoft, borderRadius: 14, padding: 14 },
    valueLabel: { fontSize: 12.5, color: c.primaryDark, fontWeight: '700' },
    valueAmount: { fontSize: 22, fontWeight: '900', color: c.text, marginTop: 2 },
    subTitle: { fontSize: 13, fontWeight: '800', color: c.text, marginTop: 16, marginBottom: 10 },
    catRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    catName: { width: 120, fontSize: 12.5, color: c.text, fontWeight: '600' },
    track: { flex: 1, height: 8, borderRadius: 5, backgroundColor: c.surface, overflow: 'hidden' },
    fill: { height: 8, borderRadius: 5 },
    catValue: { width: 78, textAlign: 'right', fontSize: 12, fontWeight: '700', color: c.textMuted },
  });

export default InventoryChart;

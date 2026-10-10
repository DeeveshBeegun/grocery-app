import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { TopProduct, money } from '../../data/analyticsData';
import ProductImage from '../ProductImage';
import ChartCard from './ChartCard';

interface Props {
  data: TopProduct[];
  limit?: number;
}

// Best-selling products table: thumbnail, name, units sold, revenue, growth.
const TopSellingProductsTable: React.FC<Props> = ({ data, limit = 6 }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <ChartCard title="Top Selling Products">
      <View style={styles.headerRow}>
        <Text style={[styles.h, styles.colProduct]}>Product</Text>
        <Text style={[styles.h, styles.colUnits]}>Units</Text>
        <Text style={[styles.h, styles.colRevenue]}>Revenue</Text>
      </View>
      {data.slice(0, limit).map((p) => {
        const up = p.growth >= 0;
        return (
          <View key={p.id} style={styles.row}>
            <View style={styles.colProduct}>
              <View style={styles.thumb}>
                <ProductImage uri={p.image} type={p.type} height={36} radius={9} iconSize={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
                <View style={styles.growthRow}>
                  <Ionicons name={up ? 'arrow-up' : 'arrow-down'} size={10} color={up ? colors.success : colors.danger} />
                  <Text style={[styles.growth, { color: up ? colors.success : colors.danger }]}>
                    {Math.abs(p.growth)}%
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[styles.units, styles.colUnits]}>{p.unitsSold} {p.unit}</Text>
            <Text style={[styles.revenue, styles.colRevenue]}>{money(p.revenue)}</Text>
          </View>
        );
      })}
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 8, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: c.border },
    h: { fontSize: 11, fontWeight: '700', color: c.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    colProduct: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
    colUnits: { width: 78, textAlign: 'right' },
    colRevenue: { width: 78, textAlign: 'right' },
    thumb: { width: 36, height: 36, borderRadius: 9, overflow: 'hidden' },
    name: { fontSize: 13.5, fontWeight: '700', color: c.text },
    growthRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 1 },
    growth: { fontSize: 11, fontWeight: '700' },
    units: { fontSize: 12.5, color: c.textMuted, fontWeight: '600' },
    revenue: { fontSize: 13.5, fontWeight: '800', color: c.text },
  });

export default TopSellingProductsTable;

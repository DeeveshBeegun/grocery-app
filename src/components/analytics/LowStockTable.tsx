import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { LowStockRow } from '../../data/analyticsData';
import ChartCard from './ChartCard';

interface Props {
  data: LowStockRow[];
}

// Low-stock / out-of-stock alert table with restock recommendations.
const LowStockTable: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (!data.length) {
    return (
      <ChartCard title="Low Stock Alerts">
        <View style={styles.empty}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
          <Text style={styles.emptyText}>All products are well stocked.</Text>
        </View>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Low Stock Alerts">
      <View style={styles.headerRow}>
        <Text style={[styles.h, styles.colName]}>Product</Text>
        <Text style={[styles.h, styles.colNum]}>Stock</Text>
        <Text style={[styles.h, styles.colNum]}>Min</Text>
        <Text style={[styles.h, styles.colRec]}>Restock</Text>
      </View>
      {data.map((r) => {
        const out = r.stock <= 0;
        return (
          <View key={r.id} style={styles.row}>
            <View style={styles.colName}>
              <View style={[styles.statusDot, { backgroundColor: out ? colors.danger : colors.warning }]} />
              <Text style={styles.name} numberOfLines={1}>{r.name}</Text>
            </View>
            <Text style={[styles.num, styles.colNum, { color: out ? colors.danger : colors.warning }]}>
              {out ? 'Out' : r.stock}
            </Text>
            <Text style={[styles.num, styles.colNum]}>{r.threshold}</Text>
            <View style={[styles.colRec, styles.recWrap]}>
              <Text style={styles.rec}>+{r.recommended}</Text>
            </View>
          </View>
        );
      })}
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 8, marginBottom: 2, borderBottomWidth: 1, borderBottomColor: c.border },
    h: { fontSize: 11, fontWeight: '700', color: c.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: c.border },
    colName: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
    colNum: { width: 52, textAlign: 'right' },
    colRec: { width: 64, alignItems: 'flex-end' },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    name: { fontSize: 13.5, fontWeight: '700', color: c.text },
    num: { fontSize: 13, fontWeight: '700', color: c.text },
    recWrap: {},
    rec: { fontSize: 12.5, fontWeight: '800', color: c.success, backgroundColor: c.success + '18', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
    empty: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
    emptyText: { fontSize: 13, color: c.textMuted },
  });

export default LowStockTable;

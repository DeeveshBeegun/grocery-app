import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Analytics, money } from '../../data/analyticsData';
import ChartCard from './ChartCard';
import HorizontalBars from './HorizontalBars';

interface Props {
  packages: Analytics['packages'];
}

// Ready-made package performance: popularity ranking + most/least ordered.
const PackageAnalyticsChart: React.FC<Props> = ({ packages }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <ChartCard title="Package Popularity">
      <View style={styles.summary}>
        <View style={[styles.pill, { backgroundColor: colors.success + '18' }]}>
          <Ionicons name="trophy-outline" size={14} color={colors.success} />
          <View>
            <Text style={styles.pillLabel}>Most ordered</Text>
            <Text style={styles.pillValue}>{packages.mostOrdered}</Text>
          </View>
        </View>
        <View style={[styles.pill, { backgroundColor: colors.warning + '18' }]}>
          <Ionicons name="arrow-down-circle-outline" size={14} color={colors.warning} />
          <View>
            <Text style={styles.pillLabel}>Least ordered</Text>
            <Text style={styles.pillValue}>{packages.leastOrdered}</Text>
          </View>
        </View>
      </View>

      <HorizontalBars
        data={packages.ranking.map((p) => ({ label: p.name, value: p.orders, valueLabel: `${p.orders}` }))}
      />

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Total package revenue</Text>
        <Text style={styles.footerValue}>{money(packages.revenue)}</Text>
      </View>
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    summary: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    pill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 12 },
    pillLabel: { fontSize: 10.5, color: c.textMuted, fontWeight: '600' },
    pillValue: { fontSize: 12.5, fontWeight: '800', color: c.text },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: c.border },
    footerLabel: { fontSize: 13, color: c.textMuted, fontWeight: '600' },
    footerValue: { fontSize: 15, fontWeight: '900', color: c.text },
  });

export default PackageAnalyticsChart;

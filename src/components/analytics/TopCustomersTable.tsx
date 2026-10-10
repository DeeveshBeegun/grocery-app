import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { TopCustomer, money } from '../../data/analyticsData';
import ChartCard from './ChartCard';

interface Props {
  data: TopCustomer[];
}

// Highest-spending customers with order counts.
const TopCustomersTable: React.FC<Props> = ({ data }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <ChartCard title="Top Customers">
      {data.map((cust, i) => (
        <View key={cust.name} style={[styles.row, i > 0 && styles.divider]}>
          <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.initials, { color: colors.primaryDark }]}>{initials(cust.name)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>{cust.name}</Text>
            <Text style={styles.orders}>{cust.orders} orders</Text>
          </View>
          <Text style={styles.spending}>{money(cust.spending)}</Text>
        </View>
      ))}
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
    divider: { borderTopWidth: 1, borderTopColor: c.border },
    avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    initials: { fontSize: 13, fontWeight: '800' },
    name: { fontSize: 14, fontWeight: '700', color: c.text },
    orders: { fontSize: 12, color: c.textMuted, marginTop: 1 },
    spending: { fontSize: 14, fontWeight: '900', color: c.text },
  });

export default TopCustomersTable;

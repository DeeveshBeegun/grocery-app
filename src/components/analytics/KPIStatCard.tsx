import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { KPI } from '../../data/analyticsData';
import Sparkline from './Sparkline';

interface Props {
  kpi: KPI;
}

// KPI summary card: icon, value, % change with trend arrow, and a sparkline.
const KPIStatCard: React.FC<Props> = ({ kpi }) => {
  const { colors } = useTheme();
  const tint =
    kpi.tintKey === 'primary'
      ? colors.primary
      : kpi.tintKey === 'success'
      ? colors.success
      : kpi.tintKey === 'warning'
      ? colors.warning
      : kpi.tintKey === 'danger'
      ? colors.danger
      : colors.info;
  const up = kpi.trend === 'up';
  const trendColor = up ? colors.success : colors.danger;
  const styles = makeStyles(colors);

  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      <View style={styles.top}>
        <View style={[styles.icon, { backgroundColor: tint + '22' }]}>
          <Ionicons name={kpi.icon} size={18} color={tint} />
        </View>
        <View style={[styles.badge, { backgroundColor: trendColor + '18' }]}>
          <Ionicons
            name={up ? 'arrow-up' : 'arrow-down'}
            size={11}
            color={trendColor}
          />
          <Text style={[styles.badgeText, { color: trendColor }]}>
            {Math.abs(kpi.changePct)}%
          </Text>
        </View>
      </View>
      <Text style={styles.value} numberOfLines={1}>{kpi.value}</Text>
      <View style={styles.bottom}>
        <Text style={styles.label} numberOfLines={1}>{kpi.label}</Text>
        <Sparkline data={kpi.spark} color={tint} width={56} height={22} />
      </View>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.card, borderRadius: 16, borderWidth: 1, padding: 13,
      shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2,
    },
    top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    icon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
    badgeText: { fontSize: 11, fontWeight: '800' },
    value: { fontSize: 22, fontWeight: '900', color: c.text, marginTop: 10 },
    bottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 },
    label: { fontSize: 12, color: c.textMuted, fontWeight: '600', flex: 1, marginRight: 6 },
  });

export default KPIStatCard;

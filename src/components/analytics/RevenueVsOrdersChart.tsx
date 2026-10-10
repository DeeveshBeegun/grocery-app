import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Polyline, Line, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { useChartWidth, hexToRgba } from './chartConfig';
import ChartCard from './ChartCard';

interface Props {
  labels: string[];
  revenue: number[];
  orders: number[];
}

const compact = (n: number) => (Math.abs(n) >= 1000 ? `${Math.round(n / 1000)}k` : String(Math.round(n)));

// Dual-axis chart: revenue as a line (left axis) over orders as bars (right axis).
// Hand-built with react-native-svg since chart-kit cannot combine bar + line.
const RevenueVsOrdersChart: React.FC<Props> = ({ labels, revenue, orders }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const width = useChartWidth(60);
  const height = 230;
  const padL = 44;
  const padR = 38;
  const padT = 16;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const n = labels.length;
  const band = plotW / n;
  const barW = Math.min(26, band * 0.42);

  const revMax = Math.max(...revenue, 1) * 1.1;
  const ordMax = Math.max(...orders, 1) * 1.15;

  const x = (i: number) => padL + i * band + band / 2;
  const revY = (v: number) => padT + plotH - (v / revMax) * plotH;
  const ordH = (v: number) => (v / ordMax) * plotH;

  const linePts = revenue.map((v, i) => `${x(i).toFixed(1)},${revY(v).toFixed(1)}`).join(' ');
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <ChartCard title="Revenue vs Orders">
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: colors.info, borderRadius: 3 }]} />
          <Text style={styles.legendText}>Orders</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.line, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Revenue</Text>
        </View>
      </View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="rvoBar" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={hexToRgba(colors.info, 0.9)} />
            <Stop offset="1" stopColor={hexToRgba(colors.info, 0.45)} />
          </LinearGradient>
        </Defs>

        {gridLines.map((g, i) => {
          const y = padT + plotH * g;
          return (
            <React.Fragment key={i}>
              <Line x1={padL} y1={y} x2={width - padR} y2={y} stroke={colors.border} strokeDasharray="4 6" strokeWidth={1} />
              {/* left axis = revenue */}
              <SvgText x={padL - 6} y={y + 3} fontSize={9} fill={colors.textMuted} textAnchor="end">
                {compact(revMax * (1 - g))}
              </SvgText>
              {/* right axis = orders */}
              <SvgText x={width - padR + 6} y={y + 3} fontSize={9} fill={colors.textMuted} textAnchor="start">
                {Math.round(ordMax * (1 - g))}
              </SvgText>
            </React.Fragment>
          );
        })}

        {orders.map((v, i) => {
          const h = ordH(v);
          return (
            <Rect
              key={i}
              x={x(i) - barW / 2}
              y={padT + plotH - h}
              width={barW}
              height={Math.max(1, h)}
              rx={4}
              fill="url(#rvoBar)"
            />
          );
        })}

        <Polyline points={linePts} fill="none" stroke={colors.primary} strokeWidth={3} strokeLinejoin="round" />
        {revenue.map((v, i) => (
          <Circle key={i} cx={x(i)} cy={revY(v)} r={3.5} fill={colors.primary} stroke={colors.card} strokeWidth={1.5} />
        ))}

        {labels.map((l, i) => (
          <SvgText key={i} x={x(i)} y={height - 8} fontSize={9.5} fill={colors.textMuted} textAnchor="middle">
            {l}
          </SvgText>
        ))}
      </Svg>
    </ChartCard>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    legend: { flexDirection: 'row', gap: 18, marginBottom: 6 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    swatch: { width: 12, height: 12 },
    line: { width: 16, height: 3, borderRadius: 2 },
    legendText: { fontSize: 12, color: c.textMuted, fontWeight: '600' },
  });

export default RevenueVsOrdersChart;

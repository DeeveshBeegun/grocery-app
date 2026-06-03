import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { GeoPoint } from '../types';

interface Props {
  customer: GeoPoint;
  driver: GeoPoint;
  progress: number;
}
/**
 * Simple map-style placeholder. Coordinates are treated as 0..1 fractions of
 * the box. No real map SDK is used (no backend / API key required).
 */
const DeliveryMapMock: React.FC<Props> = ({ customer, driver, progress }) => {
  const { colors } = useTheme();
  const toPct = (v: number): `${number}%` => `${Math.max(4, Math.min(96, v * 100))}%`;
  return (
    <View style={[styles.map, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}>
      {/* faux streets */}
      {[0.25, 0.5, 0.75].map((p) => (
        <View key={'h' + p} style={[styles.streetH, { top: `${p * 100}%`, backgroundColor: colors.card }]} />
      ))}
      {[0.3, 0.6].map((p) => (
        <View key={'v' + p} style={[styles.streetV, { left: `${p * 100}%`, backgroundColor: colors.card }]} />
      ))}

      {/* route line */}
      <View style={[styles.routeDot, { left: toPct(driver.longitude), top: toPct(driver.latitude), backgroundColor: colors.primary }]} />
      <View style={[styles.routeDot, { left: toPct(customer.longitude), top: toPct(customer.latitude), backgroundColor: colors.primaryDark }]} />

      {/* driver marker */}
      <View style={[styles.marker, { left: toPct(driver.longitude), top: toPct(driver.latitude), backgroundColor: colors.primary }]}>
        <Ionicons name="bicycle" size={16} color="#fff" />
      </View>
      {/* customer marker */}
      <View style={[styles.marker, { left: toPct(customer.longitude), top: toPct(customer.latitude), backgroundColor: colors.danger }]}>
        <Ionicons name="home" size={14} color="#fff" />
      </View>

      <View style={[styles.legend, { backgroundColor: colors.card }]}>
        <Text style={[styles.legendText, { color: colors.textMuted }]}>Driver {progress}% there</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  map: { height: 220, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  streetH: { position: 'absolute', left: 0, right: 0, height: 8, opacity: 0.7 },
  streetV: { position: 'absolute', top: 0, bottom: 0, width: 8, opacity: 0.7 },
  routeDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, marginLeft: -4, marginTop: -4, opacity: 0.5 },
  marker: { position: 'absolute', width: 30, height: 30, borderRadius: 15, marginLeft: -15, marginTop: -15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  legend: { position: 'absolute', bottom: 10, left: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  legendText: { fontSize: 11, fontWeight: '700' },
});
export default DeliveryMapMock;

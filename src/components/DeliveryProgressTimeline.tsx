import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { DeliveryStep } from '../types';

interface Props { steps: DeliveryStep[]; }
const DeliveryProgressTimeline: React.FC<Props> = ({ steps }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        const active = step.done && (!steps[i + 1] || !steps[i + 1].done);
        return (
          <View key={step.label} style={styles.row}>
            <View style={styles.railCol}>
              <View style={[styles.node, { backgroundColor: step.done ? colors.primary : colors.surface, borderColor: step.done ? colors.primary : colors.border }]}>
                {step.done ? <Ionicons name="checkmark" size={13} color="#fff" /> : <View style={[styles.emptyDot, { backgroundColor: colors.border }]} />}
              </View>
              {!last && <View style={[styles.line, { backgroundColor: step.done ? colors.primary : colors.border }]} />}
            </View>
            <View style={{ flex: 1, paddingBottom: last ? 0 : 18 }}>
              <Text style={[styles.label, { color: step.done ? colors.text : colors.textMuted }, active && { fontWeight: '900' }]}>{step.label}</Text>
              {active && <Text style={[styles.now, { color: colors.primary }]}>In progress</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  wrap: { paddingVertical: 4 },
  row: { flexDirection: 'row' },
  railCol: { alignItems: 'center', marginRight: 14, width: 26 },
  node: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  emptyDot: { width: 8, height: 8, borderRadius: 4 },
  line: { width: 2, flex: 1, marginVertical: 2 },
  label: { fontSize: 14, fontWeight: '600' },
  now: { fontSize: 12, fontWeight: '700', marginTop: 2 },
});
export default DeliveryProgressTimeline;

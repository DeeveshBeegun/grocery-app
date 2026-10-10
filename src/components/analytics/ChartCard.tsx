import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

// Rounded card surface that hosts a chart or table inside a section.
const ChartCard: React.FC<Props> = ({ title, right, children, style, padded = true }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={[styles.card, padded && styles.padded, style]}>
      {(title || right) && (
        <View style={[styles.head, !padded && styles.headInset]}>
          {title ? <Text style={styles.title}>{title}</Text> : <View />}
          {right}
        </View>
      )}
      {children}
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.card, borderRadius: 18, borderWidth: 1, borderColor: c.border,
      shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2,
      overflow: 'hidden',
    },
    padded: { padding: 14 },
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 10 },
    headInset: { paddingHorizontal: 14, paddingTop: 14 },
    title: { fontSize: 14.5, fontWeight: '800', color: c.text, flex: 1 },
  });

export default ChartCard;

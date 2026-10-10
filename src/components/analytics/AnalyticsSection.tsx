import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  right?: React.ReactNode;
  children: React.ReactNode;
}

// Standard titled wrapper used by every analytics block on the dashboard.
const AnalyticsSection: React.FC<Props> = ({ title, subtitle, icon, right, children }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.section}>
      <View style={styles.head}>
        <View style={styles.titleRow}>
          {icon ? (
            <View style={styles.iconWrap}>
              <Ionicons name={icon} size={16} color={colors.primaryDark} />
            </View>
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      </View>
      {children}
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    section: { marginTop: 26 },
    head: { marginBottom: 12 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconWrap: {
      width: 30, height: 30, borderRadius: 9,
      backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center',
    },
    title: { fontSize: 17, fontWeight: '800', color: c.text },
    subtitle: { fontSize: 12.5, color: c.textMuted, marginTop: 2 },
  });

export default AnalyticsSection;

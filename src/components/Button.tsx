import React from 'react';
import { Text, StyleSheet, ActivityIndicator, Pressable, StyleProp, ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}
const Button: React.FC<Props> = ({
  title, onPress, variant = 'primary', size = 'md', icon, disabled, loading, fullWidth = true, style,
}) => {
  const { colors } = useTheme();
  const pad = size === 'lg' ? 16 : size === 'sm' ? 9 : 13;
  const font = size === 'lg' ? 17 : size === 'sm' ? 13 : 15;

  const bg = variant === 'primary' ? colors.primary
    : variant === 'danger' ? colors.danger
    : 'transparent';
  const textColor = variant === 'primary' || variant === 'danger' ? colors.onPrimary
    : variant === 'outline' ? colors.primary
    : colors.primary;
  const borderColor = variant === 'outline' ? colors.primary : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor, borderWidth: variant === 'outline' ? 1.5 : 0, paddingVertical: pad },
        fullWidth && { alignSelf: 'stretch' },
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.row}>
          {icon && <Ionicons name={icon} size={font + 3} color={textColor} style={{ marginRight: 8 }} />}
          <Text style={[styles.text, { color: textColor, fontSize: font }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  btn: { borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '700' },
});
export default Button;

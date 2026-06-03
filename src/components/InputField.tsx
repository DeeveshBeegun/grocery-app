import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

interface Props extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
}
const InputField: React.FC<Props> = ({ label, icon, containerStyle, error, style, ...rest }) => {
  const { colors } = useTheme();
  return (
    <View style={[{ marginBottom: 14 }, containerStyle]}>
      {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}
      <View style={[styles.field, { backgroundColor: colors.surface, borderColor: error ? colors.danger : colors.border }]}>
        {icon && <Ionicons name={icon} size={18} color={colors.textMuted} style={{ marginRight: 8 }} />}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }, style]}
          {...rest}
        />
      </View>
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
};
const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  field: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, minHeight: 48 },
  input: { flex: 1, fontSize: 15, paddingVertical: 10 },
  error: { fontSize: 12, marginTop: 4, fontWeight: '600' },
});
export default InputField;

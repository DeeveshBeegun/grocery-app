import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/**
 * Logo placeholder. Replace the inner <Text>LOGO</Text> with an <Image>
 * (e.g. <Image source={require('../assets/logo.png')} style={...} />)
 * when a real brand logo is available.
 */
interface Props {
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}
const LogoPlaceholder: React.FC<Props> = ({ size = 'md', style }) => {
  const { colors } = useTheme();
  const dims = size === 'lg' ? 88 : size === 'sm' ? 36 : 44;
  const font = size === 'lg' ? 20 : size === 'sm' ? 11 : 13;
  return (
    <View
      style={[
        styles.box,
        {
          width: size === 'lg' ? 120 : dims * 2.1,
          height: dims,
          borderRadius: dims / 4,
          backgroundColor: colors.primarySoft,
          borderColor: colors.primary,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: colors.primary, fontSize: font }]}>LOGO</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderStyle: 'dashed' },
  text: { fontWeight: '800', letterSpacing: 2 },
});
export default LogoPlaceholder;

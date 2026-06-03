import React from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { ProductType } from '../types';

interface Props {
  uri?: string | null;
  type?: ProductType;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
}
/** Shows uploaded image if present, otherwise a themed placeholder icon. */
const ProductImage: React.FC<Props> = ({ uri, type = 'Vegetable', height = 120, radius = 14, style, iconSize = 40 }) => {
  const { colors } = useTheme();
  if (uri) {
    return <Image source={{ uri }} style={[{ height, borderRadius: radius, width: '100%' }, style] as StyleProp<ImageStyle>} resizeMode="cover" />;
  }
  return (
    <View style={[styles.ph, { height, borderRadius: radius, backgroundColor: colors.primarySoft }, style]}>
      <Ionicons name={type === 'Fruit' ? 'nutrition' : 'leaf'} size={iconSize} color={colors.primary} />
    </View>
  );
};
const styles = StyleSheet.create({ ph: { width: '100%', alignItems: 'center', justifyContent: 'center' } });
export default ProductImage;

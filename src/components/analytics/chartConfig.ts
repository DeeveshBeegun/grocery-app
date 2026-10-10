import { useWindowDimensions } from 'react-native';
import { ThemeColors } from '../../theme/ThemeContext';

// Convert a #rrggbb / #rgb hex to an rgba() string with the given opacity.
export const hexToRgba = (hex: string, opacity = 1): string => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// react-native-chart-kit config derived from the live theme.
export const buildChartConfig = (
  colors: ThemeColors,
  lineHex?: string,
) => {
  const accent = lineHex ?? colors.primary;
  return {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => hexToRgba(accent, opacity),
    labelColor: (opacity = 1) => hexToRgba(colors.textMuted, Math.min(1, opacity + 0.2)),
    fillShadowGradient: accent,
    fillShadowGradientFrom: accent,
    fillShadowGradientTo: colors.card,
    fillShadowGradientOpacity: 0.18,
    fillShadowGradientFromOpacity: 0.22,
    fillShadowGradientToOpacity: 0.02,
    barPercentage: 0.6,
    propsForDots: { r: '3.5', strokeWidth: '2', stroke: colors.card },
    propsForBackgroundLines: { stroke: colors.border, strokeDasharray: '4 6' },
    propsForLabels: { fontSize: 10 },
  };
};

// Responsive chart width capped so charts don't stretch absurdly wide on web.
export const useChartWidth = (horizontalPadding = 32, maxWidth = 560): number => {
  const { width } = useWindowDimensions();
  return Math.min(width - horizontalPadding, maxWidth);
};

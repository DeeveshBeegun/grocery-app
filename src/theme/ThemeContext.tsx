import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_COLOR = '#2E7D32';
const STORAGE_KEY = '@app_primary_color';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primarySoft: string; // very light tint for backgrounds
  onPrimary: string; // text/icon color on primary
  background: string;
  surface: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
}

interface ThemeContextValue {
  primaryColor: string;
  colors: ThemeColors;
  setPrimaryColor: (hex: string) => void;
  resetColor: () => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// --- small color helpers (no external deps) ---
const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

const hexToRgb = (hex: string) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const rgbToHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('');

const shade = (hex: string, percent: number) => {
  const { r, g, b } = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  return rgbToHex(
    (t - r) * p + r,
    (t - g) * p + g,
    (t - b) * p + b
  );
};

const tint = (hex: string, alphaLikePercent: number) => shade(hex, alphaLikePercent);

export const isValidHex = (value: string) =>
  /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());

export const normalizeHex = (value: string) => {
  let v = value.trim();
  if (!v.startsWith('#')) v = '#' + v;
  if (v.length === 4) {
    v = '#' + v.slice(1).split('').map((c) => c + c).join('');
  }
  return v.toUpperCase();
};

const buildColors = (primary: string): ThemeColors => ({
  primary,
  primaryDark: shade(primary, -0.25),
  primaryLight: tint(primary, 0.35),
  primarySoft: tint(primary, 0.88),
  onPrimary: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#F6F7F9',
  card: '#FFFFFF',
  text: '#1A1D1F',
  textMuted: '#6F767E',
  border: '#ECEEF1',
  danger: '#E53935',
  warning: '#F59E0B',
  success: '#2E9E5B',
  info: '#2D7FF9',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColorState] = useState<string>(DEFAULT_COLOR);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && isValidHex(stored)) {
          setPrimaryColorState(normalizeHex(stored));
        }
      } catch {
        // ignore storage errors, fall back to default
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const setPrimaryColor = useCallback((hex: string) => {
    if (!isValidHex(hex)) return;
    const normalized = normalizeHex(hex);
    setPrimaryColorState(normalized);
    AsyncStorage.setItem(STORAGE_KEY, normalized).catch(() => {});
  }, []);

  const resetColor = useCallback(() => {
    setPrimaryColorState(DEFAULT_COLOR);
    AsyncStorage.setItem(STORAGE_KEY, DEFAULT_COLOR).catch(() => {});
  }, []);

  const colors = buildColors(primaryColor);

  return (
    <ThemeContext.Provider value={{ primaryColor, colors, setPrimaryColor, resetColor, isReady }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

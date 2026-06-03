import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LogoPlaceholder from './LogoPlaceholder';

interface Props {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  showLogo?: boolean;
  onBack?: () => void;
}
const Header: React.FC<Props> = ({ title, showBack, showCart = true, showLogo = true, onBack }) => {
  const { colors } = useTheme();
  const { count } = useCart();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const isCustomer = user?.role === 'customer';

  const goCart = () => navigation.navigate('My Cart');

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderBottomColor: colors.border, paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={onBack ?? (() => navigation.goBack())} hitSlop={10} style={[styles.iconBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
        ) : (
          <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} hitSlop={10} style={[styles.iconBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="menu" size={24} color={colors.text} />
          </Pressable>
        )}

        <View style={styles.center}>
          {showLogo ? <LogoPlaceholder size="sm" /> : null}
          {title ? <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text> : null}
        </View>

        {showCart && isCustomer ? (
          <Pressable onPress={goCart} hitSlop={10} style={[styles.iconBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="cart-outline" size={22} color={colors.text} />
            {count > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
              </View>
            )}
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  title: { fontSize: 16, fontWeight: '800', maxWidth: 160 },
  badge: { position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
});
export default Header;

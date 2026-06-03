import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../components/Button';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/currency';

const OrderConfirmationScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { getOrder } = useData();
  const orderId: string = route.params?.orderId;
  const order = getOrder(orderId);
  const styles = makeStyles(colors);

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
          <View style={[styles.badgeInner, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={48} color={colors.onPrimary} />
          </View>
        </View>

        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Thank you. Your fresh produce is on its way to being prepared.</Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Order number</Text>
            <Text style={[styles.cardValue, { color: colors.primaryDark }]}>{orderId}</Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Estimated delivery</Text>
            <Text style={styles.cardValue}>{order?.estimatedDeliveryTime ?? '40 min'}</Text>
          </View>
          {order ? (
            <>
              <View style={styles.cardDivider} />
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Total</Text>
                <Text style={styles.cardValue}>{formatPrice(order.totalAmount)}</Text>
              </View>
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Track Order" icon="navigate-outline" onPress={() => navigation.navigate('DeliveryTracking', { orderId })} />
        <Button title="View My Orders" variant="outline" icon="receipt-outline" onPress={() => navigation.navigate('My Orders')} style={{ marginTop: 10 }} />
        <Button title="Back to Home" variant="ghost" onPress={() => navigation.navigate('Home')} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface, justifyContent: 'space-between' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    badge: { width: 128, height: 128, borderRadius: 64, alignItems: 'center', justifyContent: 'center' },
    badgeInner: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 26, fontWeight: '800', color: c.text, marginTop: 24 },
    subtitle: { fontSize: 15, color: c.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 22 },
    card: { width: '100%', borderRadius: 18, borderWidth: 1, padding: 18, marginTop: 28 },
    cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardLabel: { fontSize: 14, color: c.textMuted },
    cardValue: { fontSize: 16, fontWeight: '700', color: c.text },
    cardDivider: { height: 1, backgroundColor: c.border, marginVertical: 12 },
    actions: { padding: 24 },
  });

export default OrderConfirmationScreen;

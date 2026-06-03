import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useTheme } from '../../theme/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { buildDeliverySteps } from '../../data/mockData';
import { Order, OrderItem } from '../../types';
import { formatPrice } from '../../utils/currency';

const TIME_SLOTS = ['09:00 - 11:00', '11:00 - 13:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'];
const PAYMENT_METHODS: Order['paymentMethod'][] = ['Cash on Delivery', 'Card', 'Mobile Payment'];

const nextDays = (n: number) => {
  const out: { label: string; value: string }[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    out.push({ label, value: d.toISOString().slice(0, 10) });
  }
  return out;
};

const CheckoutScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { addOrder } = useData();
  const { user } = useAuth();

  const days = nextDays(5);
  const [name, setName] = useState(user?.name ?? '');
  const [address, setAddress] = useState(user?.addresses?.[0] ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [date, setDate] = useState(days[1].value);
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [payment, setPayment] = useState<Order['paymentMethod']>('Cash on Delivery');
  const [error, setError] = useState('');

  const styles = makeStyles(colors);

  const placeOrder = () => {
    if (!name.trim() || !address.trim() || !phone.trim()) {
      setError('Please complete your name, address and phone number.');
      return;
    }
    setError('');
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderItems: OrderItem[] = items.map((l) => ({
      name: l.name, quantity: l.quantity, unitLabel: l.unitLabel, price: l.price, kind: l.kind,
    }));
    const order: Order = {
      orderId,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      deliveryAddress: address.trim(),
      items: orderItems,
      totalAmount: Number(total.toFixed(2)),
      paymentMethod: payment,
      orderStatus: 'Pending',
      deliveryStatus: 'Order Placed',
      driverName: 'Driver Placeholder',
      driverPhone: '+230 5 000 0000',
      estimatedDeliveryTime: '40 min',
      date: new Date().toISOString().slice(0, 10),
      customerLocation: { latitude: 0.82, longitude: 0.5 },
      driverLocation: { latitude: 0.12, longitude: 0.15 },
      progressPercentage: 5,
      deliverySteps: buildDeliverySteps(0),
    };
    addOrder(order);
    clearCart();
    navigation.navigate('OrderConfirmation', { orderId });
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <View style={styles.root}>
      <Header title="Checkout" showBack onBack={() => navigation.goBack()} showCart={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Section title="Delivery Address">
          <InputField label="Full name" icon="person-outline" value={name} onChangeText={setName} placeholder="Your name" />
          <InputField label="Address" icon="location-outline" value={address} onChangeText={setAddress} placeholder="Street, area, city" multiline />
          <InputField label="Phone number" icon="call-outline" value={phone} onChangeText={setPhone} placeholder="+230 5 000 0000" keyboardType="phone-pad" />
        </Section>

        <Section title="Delivery Date">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            {days.map((d) => {
              const active = date === d.value;
              return (
                <Pressable key={d.value} onPress={() => setDate(d.value)} style={[styles.dateChip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primarySoft : colors.card }]}>
                  <Text style={[styles.dateChipText, { color: active ? colors.primaryDark : colors.textMuted }]}>{d.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Section>

        <Section title="Time Slot">
          <View style={styles.slotWrap}>
            {TIME_SLOTS.map((s) => {
              const active = slot === s;
              return (
                <Pressable key={s} onPress={() => setSlot(s)} style={[styles.slotChip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primarySoft : colors.card }]}>
                  <Ionicons name="time-outline" size={14} color={active ? colors.primaryDark : colors.textMuted} />
                  <Text style={[styles.slotText, { color: active ? colors.primaryDark : colors.textMuted }]}>{s}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Payment Method">
          {PAYMENT_METHODS.map((m) => {
            const active = payment === m;
            const icon = m === 'Cash on Delivery' ? 'cash-outline' : m === 'Card' ? 'card-outline' : 'phone-portrait-outline';
            return (
              <Pressable key={m} onPress={() => setPayment(m)} style={[styles.payRow, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primarySoft : colors.card }]}>
                <Ionicons name={icon as any} size={20} color={active ? colors.primaryDark : colors.textMuted} />
                <Text style={[styles.payText, { color: active ? colors.text : colors.textMuted }]}>{m}</Text>
                <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={20} color={active ? colors.primary : colors.border} />
              </Pressable>
            );
          })}
        </Section>

        <View style={[styles.summary, { backgroundColor: colors.primarySoft }]}>
          <View style={styles.sumRow}><Text style={styles.sumLabel}>Subtotal</Text><Text style={styles.sumVal}>{formatPrice(subtotal)}</Text></View>
          <View style={styles.sumRow}><Text style={styles.sumLabel}>Delivery fee</Text><Text style={styles.sumVal}>{formatPrice(deliveryFee)}</Text></View>
          <View style={styles.sumRow}><Text style={styles.sumTotalLabel}>Total</Text><Text style={[styles.sumTotal, { color: colors.primaryDark }]}>{formatPrice(total)}</Text></View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Place Order" icon="checkmark-circle-outline" onPress={placeOrder} style={{ marginTop: 12 }} disabled={items.length === 0} />
      </ScrollView>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    content: { padding: 16, paddingBottom: 40 },
    section: { marginBottom: 18 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: c.text, marginBottom: 10 },
    chipScroll: { gap: 8, paddingVertical: 2 },
    dateChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
    dateChipText: { fontSize: 13, fontWeight: '600' },
    slotWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    slotChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, borderWidth: 1 },
    slotText: { fontSize: 13, fontWeight: '600' },
    payRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
    payText: { flex: 1, fontSize: 15, fontWeight: '600' },
    summary: { borderRadius: 16, padding: 16, marginTop: 4 },
    sumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
    sumLabel: { fontSize: 14, color: c.textMuted },
    sumVal: { fontSize: 14, color: c.text, fontWeight: '600' },
    sumTotalLabel: { fontSize: 16, fontWeight: '800', color: c.text, marginTop: 4 },
    sumTotal: { fontSize: 20, fontWeight: '800', marginTop: 4 },
    error: { color: c.danger, fontSize: 13, marginTop: 10 },
  });

export default CheckoutScreen;

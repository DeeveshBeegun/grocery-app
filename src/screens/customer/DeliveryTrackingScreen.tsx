import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import TrackingStatusCard from '../../components/TrackingStatusCard';
import DeliveryMapMock from '../../components/DeliveryMapMock';
import DriverInfoCard from '../../components/DriverInfoCard';
import DeliveryProgressTimeline from '../../components/DeliveryProgressTimeline';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { deliveryStatusFlow } from '../../data/mockData';

const DeliveryTrackingScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { getOrder, updateDeliveryStatus } = useData();
  const orderId: string = route.params?.orderId;
  const order = getOrder(orderId);

  const [live, setLive] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulated live tracking: advance the delivery status every few seconds.
  useEffect(() => {
    if (!live || !order) return;
    timer.current = setInterval(() => {
      const current = getOrder(orderId);
      if (!current) return;
      const idx = deliveryStatusFlow.indexOf(current.deliveryStatus);
      if (idx >= deliveryStatusFlow.length - 1) {
        if (timer.current) clearInterval(timer.current);
        setLive(false);
        return;
      }
      updateDeliveryStatus(orderId, deliveryStatusFlow[idx + 1]);
    }, 4000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [live, orderId, order?.orderId]);

  const styles = makeStyles(colors);

  if (!order) {
    return (
      <View style={styles.root}>
        <Header title="Track Order" showBack onBack={() => navigation.goBack()} showCart={false} />
        <View style={styles.missing}>
          <Ionicons name="navigate-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.missingText}>Order not found.</Text>
        </View>
      </View>
    );
  }

  const delivered = order.deliveryStatus === 'Delivered';

  return (
    <View style={styles.root}>
      <Header title="Track Order" showBack onBack={() => navigation.goBack()} showCart={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.orderRow}>
          <Text style={styles.orderId}>{order.orderId}</Text>
          <View style={[styles.liveTag, { backgroundColor: delivered ? colors.success : (live ? colors.primarySoft : colors.surface) }]}>
            <View style={[styles.dot, { backgroundColor: delivered ? colors.onPrimary : (live ? colors.primary : colors.textMuted) }]} />
            <Text style={[styles.liveText, { color: delivered ? colors.onPrimary : (live ? colors.primaryDark : colors.textMuted) }]}>
              {delivered ? 'Delivered' : live ? 'Live' : 'Paused'}
            </Text>
          </View>
        </View>

        <TrackingStatusCard order={order} />

        <Text style={styles.sectionTitle}>Live Location</Text>
        <DeliveryMapMock customer={order.customerLocation} driver={order.driverLocation} progress={order.progressPercentage} />

        {!delivered && (
          <Pressable onPress={() => setLive((l) => !l)} style={[styles.toggle, { borderColor: colors.border }]}>
            <Ionicons name={live ? 'pause' : 'play'} size={16} color={colors.primaryDark} />
            <Text style={[styles.toggleText, { color: colors.primaryDark }]}>{live ? 'Pause live updates' : 'Resume live updates'}</Text>
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>Driver</Text>
        <DriverInfoCard name={order.driverName} phone={order.driverPhone} />

        <Text style={styles.sectionTitle}>Delivery Progress</Text>
        <DeliveryProgressTimeline steps={order.deliverySteps} />
      </ScrollView>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    content: { padding: 16, paddingBottom: 40 },
    orderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    orderId: { fontSize: 20, fontWeight: '800', color: c.text },
    liveTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    liveText: { fontSize: 12, fontWeight: '700' },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: c.text, marginTop: 20, marginBottom: 10 },
    toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderRadius: 12, paddingVertical: 10, marginTop: 12 },
    toggleText: { fontSize: 14, fontWeight: '700' },
    missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    missingText: { color: c.textMuted, fontSize: 15 },
  });

export default DeliveryTrackingScreen;

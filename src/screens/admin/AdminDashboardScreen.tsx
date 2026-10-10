import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { useTheme } from '../../theme/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { getAnalytics, RangeKey, CHART_PALETTE } from '../../data/analyticsData';

import AnalyticsSection from '../../components/analytics/AnalyticsSection';
import DashboardFilterBar from '../../components/analytics/DashboardFilterBar';
import KPIStatCard from '../../components/analytics/KPIStatCard';
import RevenueChart from '../../components/analytics/RevenueChart';
import OrdersChart from '../../components/analytics/OrdersChart';
import RevenueVsOrdersChart from '../../components/analytics/RevenueVsOrdersChart';
import TopSellingProductsTable from '../../components/analytics/TopSellingProductsTable';
import ProductPerformanceChart from '../../components/analytics/ProductPerformanceChart';
import CategoryPerformanceChart from '../../components/analytics/CategoryPerformanceChart';
import InventoryChart from '../../components/analytics/InventoryChart';
import LowStockTable from '../../components/analytics/LowStockTable';
import CustomerAnalyticsChart from '../../components/analytics/CustomerAnalyticsChart';
import TopCustomersTable from '../../components/analytics/TopCustomersTable';
import DeliveryAnalyticsChart from '../../components/analytics/DeliveryAnalyticsChart';
import AnalyticsDeliveryMap from '../../components/analytics/AnalyticsDeliveryMap';
import PackageAnalyticsChart from '../../components/analytics/PackageAnalyticsChart';
import ForecastChart from '../../components/analytics/ForecastChart';
import ExportReportButtons from '../../components/analytics/ExportReportButtons';
import ChartCard from '../../components/analytics/ChartCard';
import DonutChart from '../../components/analytics/DonutChart';

const AdminDashboardScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { products, orders } = useData();
  const { user } = useAuth();
  const { width } = useWindowDimensions();

  const [range, setRange] = useState<RangeKey>('30d');
  const analytics = useMemo(() => getAnalytics(range, products, orders), [range, products, orders]);

  // Responsive KPI grid columns.
  const columns = width > 1040 ? 4 : width > 720 ? 3 : 2;
  const cellWidth = `${100 / columns - 2}%`;

  const styles = makeStyles(colors);

  const actions = [
    { label: 'Add Product', icon: 'add-circle-outline', route: 'Add Product' },
    { label: 'Manage Orders', icon: 'receipt-outline', route: 'Manage Orders' },
    { label: 'Manage Packages', icon: 'cube-outline', route: 'Manage Packages' },
  ] as const;

  const categoryPie = analytics.categories.map((c, i) => ({
    label: c.name,
    value: c.revenue,
    color: CHART_PALETTE[i % CHART_PALETTE.length],
  }));

  return (
    <View style={styles.root}>
      <Header title="Admin Dashboard" showCart={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Hi {user?.name?.split(' ')[0] ?? 'Admin'} 👋</Text>
        <Text style={styles.subtitle}>Business overview · {analytics.rangeLabel}</Text>

        <View style={styles.filterWrap}>
          <DashboardFilterBar value={range} onChange={setRange} />
        </View>

        {/* KPI cards */}
        <View style={styles.grid}>
          {analytics.kpis.map((kpi) => (
            <View key={kpi.key} style={[styles.gridCell, { width: cellWidth as any }]}>
              <KPIStatCard kpi={kpi} />
            </View>
          ))}
        </View>

        {/* Sales analytics */}
        <AnalyticsSection title="Sales Analytics" subtitle="Revenue and order trends" icon="trending-up-outline">
          <View style={styles.stack}>
            <RevenueChart labels={analytics.revenue.labels} series={analytics.revenue.series} />
            <OrdersChart labels={analytics.orders.labels} series={analytics.orders.series} />
            <RevenueVsOrdersChart
              labels={analytics.revenueVsOrders.labels}
              revenue={analytics.revenueVsOrders.revenue}
              orders={analytics.revenueVsOrders.orders}
            />
          </View>
        </AnalyticsSection>

        {/* Best selling products */}
        <AnalyticsSection title="Best Selling Products" subtitle="Top performers by units & revenue" icon="ribbon-outline">
          <View style={styles.stack}>
            <TopSellingProductsTable data={analytics.topProducts} />
            <ProductPerformanceChart data={analytics.topProducts} />
            <ChartCard title="Product Sales Distribution">
              <DonutChart data={analytics.productDistribution} centerLabel="units sold" />
            </ChartCard>
          </View>
        </AnalyticsSection>

        {/* Category performance */}
        <AnalyticsSection title="Category Performance" subtitle="Revenue and growth by category" icon="grid-outline">
          <View style={styles.stack}>
            <CategoryPerformanceChart data={analytics.categories} />
            <ChartCard title="Revenue Share by Category">
              <DonutChart data={categoryPie} centerLabel="categories" />
            </ChartCard>
          </View>
        </AnalyticsSection>

        {/* Inventory */}
        <AnalyticsSection title="Inventory Analytics" subtitle="Stock health and value" icon="file-tray-stacked-outline">
          <View style={styles.stack}>
            <InventoryChart inventory={analytics.inventory} />
            <LowStockTable data={analytics.lowStock} />
          </View>
        </AnalyticsSection>

        {/* Customers */}
        <AnalyticsSection title="Customer Analytics" subtitle="Growth, segments and top spenders" icon="people-outline">
          <View style={styles.stack}>
            <CustomerAnalyticsChart
              labels={analytics.customers.growth.labels}
              newCustomers={analytics.customers.growth.newCustomers}
              returning={analytics.customers.growth.returning}
            />
            <ChartCard title="Customer Segmentation">
              <DonutChart data={analytics.customers.segmentation} centerValue={`${analytics.customers.total}`} centerLabel="customers" />
            </ChartCard>
            <TopCustomersTable data={analytics.customers.top} />
          </View>
        </AnalyticsSection>

        {/* Delivery */}
        <AnalyticsSection title="Delivery Analytics" subtitle="Status, performance and live map" icon="navigate-outline">
          <View style={styles.stack}>
            <DeliveryAnalyticsChart delivery={analytics.delivery} />
            <AnalyticsDeliveryMap markers={analytics.delivery.markers} />
          </View>
        </AnalyticsSection>

        {/* Packages */}
        <AnalyticsSection title="Package Analytics" subtitle="Ready-made package performance" icon="cube-outline">
          <PackageAnalyticsChart packages={analytics.packages} />
        </AnalyticsSection>

        {/* Forecast */}
        <AnalyticsSection title="Sales Forecasting" subtitle="Projected revenue and orders" icon="analytics-outline">
          <ForecastChart forecast={analytics.forecast} />
        </AnalyticsSection>

        {/* Export */}
        <AnalyticsSection title="Export & Reporting" subtitle="Download mock business reports" icon="download-outline">
          <ExportReportButtons />
        </AnalyticsSection>

        {/* Quick actions */}
        <AnalyticsSection title="Quick Actions" icon="flash-outline">
          <View style={styles.actions}>
            {actions.map((a) => (
              <Pressable
                key={a.route}
                style={[styles.action, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate(a.route)}
              >
                <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
                  <Ionicons name={a.icon as any} size={22} color={colors.primaryDark} />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </AnalyticsSection>
      </ScrollView>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.surface },
    content: { padding: 16, paddingBottom: 48, maxWidth: 920, width: '100%', alignSelf: 'center' },
    greeting: { fontSize: 24, fontWeight: '800', color: c.text },
    subtitle: { fontSize: 14, color: c.textMuted, marginTop: 4, marginBottom: 16 },
    filterWrap: { marginBottom: 18 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    gridCell: { flexGrow: 1, minWidth: 150 },
    stack: { gap: 14 },
    actions: { gap: 12 },
    action: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 16, borderWidth: 1 },
    actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    actionLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: c.text },
  });

export default AdminDashboardScreen;

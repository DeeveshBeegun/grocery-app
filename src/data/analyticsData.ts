// ---------------------------------------------------------------------------
// Analytics mock-data layer
// ---------------------------------------------------------------------------
// Generates realistic, deterministic business-intelligence data for the admin
// dashboard. Everything is mock data (no backend). Values are derived partly
// from the live products/orders in DataContext and partly from seeded series so
// the dashboard looks like a production grocery analytics panel.
// ---------------------------------------------------------------------------

import { Ionicons } from '@expo/vector-icons';
import { Product, Order, ProductType } from '../types';

// --- Date range filter -----------------------------------------------------

export type RangeKey =
  | 'today'
  | '7d'
  | '30d'
  | '90d'
  | 'month'
  | 'year'
  | 'custom';

export interface RangeOption {
  key: RangeKey;
  label: string;
}

export const RANGE_OPTIONS: RangeOption[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'Last 30 Days' },
  { key: '90d', label: 'Last 90 Days' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
  { key: 'custom', label: 'Custom' },
];

// Per-range tuning: number of points and a scale factor applied to base volumes.
const RANGE_CONFIG: Record<RangeKey, { points: number; scale: number; tick: number }> = {
  today: { points: 12, scale: 0.04, tick: 3 },
  '7d': { points: 7, scale: 0.25, tick: 1 },
  '30d': { points: 30, scale: 1, tick: 5 },
  '90d': { points: 12, scale: 3, tick: 2 },
  month: { points: 30, scale: 1, tick: 5 },
  year: { points: 12, scale: 12, tick: 1 },
  custom: { points: 14, scale: 0.5, tick: 2 },
};

// --- Seeded helpers (deterministic so charts stay stable across renders) ----

const seeded = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const makeSeries = (
  n: number,
  base: number,
  amp: number,
  seed: number,
  trendUp = true,
): number[] => {
  const rnd = seeded(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0;
    const trend = trendUp ? 0.7 + 0.6 * t : 1.3 - 0.6 * t;
    const wave = 1 + amp * Math.sin(i * 0.85 + seed);
    const noise = 0.85 + 0.3 * rnd();
    out.push(Math.max(0, Math.round(base * trend * wave * noise)));
  }
  return out;
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const pctChange = (current: number, previous: number) => {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
};

// --- Public shapes ---------------------------------------------------------

export type Trend = 'up' | 'down';

export interface KPI {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  changePct: number;
  trend: Trend;
  spark: number[];
  tintKey: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface TopProduct {
  id: string;
  name: string;
  image?: string | null;
  type: ProductType;
  unit: string;
  unitsSold: number;
  revenue: number;
  growth: number;
}

export interface CategoryPerf {
  name: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface LowStockRow {
  id: string;
  name: string;
  stock: number;
  threshold: number;
  recommended: number;
}

export interface TopCustomer {
  name: string;
  orders: number;
  spending: number;
}

export interface PackageRank {
  id: string;
  name: string;
  orders: number;
  revenue: number;
}

export interface Granularity<T = number[]> {
  daily: T;
  weekly: T;
  monthly: T;
  yearly: T;
}

export interface Analytics {
  rangeLabel: string;
  kpis: KPI[];

  revenue: {
    labels: Granularity<string[]>;
    series: Granularity;
  };
  orders: {
    labels: { daily: string[]; weekly: string[]; monthly: string[] };
    series: { daily: number[]; weekly: number[]; monthly: number[] };
  };
  revenueVsOrders: { labels: string[]; revenue: number[]; orders: number[] };

  topProducts: TopProduct[];
  productDistribution: { label: string; value: number; color: string }[];

  categories: CategoryPerf[];

  inventory: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
    totalValue: number;
    byCategory: { name: string; value: number }[];
  };
  lowStock: LowStockRow[];

  customers: {
    total: number;
    growth: { labels: string[]; newCustomers: number[]; returning: number[] };
    segmentation: { label: string; value: number; color: string }[];
    top: TopCustomer[];
  };

  delivery: {
    statusBreakdown: { label: string; value: number; color: string }[];
    avgTime: string;
    fastest: string;
    delayed: number;
    onTimePct: number;
    markers: { id: string; kind: 'driver' | 'customer'; x: number; y: number; label: string }[];
  };

  packages: {
    ranking: PackageRank[];
    mostOrdered: string;
    leastOrdered: string;
    revenue: number;
  };

  forecast: {
    labels: string[];
    actual: (number | null)[];
    projected: (number | null)[];
    nextWeekRevenue: number;
    nextMonthRevenue: number;
    nextMonthOrders: number;
  };
}

// Palette for categorical charts (kept independent of the dynamic theme).
export const CHART_PALETTE = [
  '#2E9E5B',
  '#2D7FF9',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#EF4444',
  '#0EA5E9',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------
export function getAnalytics(
  range: RangeKey,
  products: Product[],
  orders: Order[],
): Analytics {
  const cfg = RANGE_CONFIG[range];
  const rangeLabel = RANGE_OPTIONS.find((r) => r.key === range)?.label ?? 'Last 30 Days';
  const seedBase = (range.length + Math.round(cfg.scale * 10)) * 17 + 31;

  // --- Inventory facts from live products ---------------------------------
  const outOfStock = products.filter((p) => !p.inStock || p.stock <= 0);
  const lowStockItems = products.filter((p) => p.inStock && p.stock > 0 && p.stock < 10);
  const inStockCount = products.length - outOfStock.length - lowStockItems.length;
  const inventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  // --- Revenue / orders base volumes scaled by range ----------------------
  const revBase = Math.round(4200 * cfg.scale) + 400;
  const ordBase = Math.round(46 * cfg.scale) + 6;

  const revSpark = makeSeries(cfg.points, revBase / cfg.points + 60, 0.22, seedBase + 1);
  const ordSpark = makeSeries(cfg.points, ordBase / cfg.points + 3, 0.25, seedBase + 2);

  const totalRevenue = sum(revSpark) * 6 + 18650;
  const totalOrders = orders.length + sum(ordSpark) + 240;
  const revenueThisMonth = Math.round(totalRevenue * 0.34);
  const revenueToday = Math.round(totalRevenue * 0.018);
  const totalCustomers = 820 + Math.round(cfg.scale * 12);

  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length + 198;
  const pendingCount =
    orders.filter((o) =>
      ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup'].includes(o.orderStatus),
    ).length + 14;
  const cancelledCount = 9;
  const activeDeliveries =
    orders.filter((o) => ['Out for Delivery', 'Nearby'].includes(o.orderStatus)).length + 5;

  // --- KPI cards ----------------------------------------------------------
  const kpis: KPI[] = [
    {
      key: 'products',
      label: 'Total Products',
      icon: 'leaf-outline',
      value: String(products.length),
      changePct: 4.2,
      trend: 'up',
      spark: makeSeries(8, 12, 0.15, seedBase + 10),
      tintKey: 'primary',
    },
    {
      key: 'orders',
      label: 'Total Orders',
      icon: 'receipt-outline',
      value: totalOrders.toLocaleString('en-US'),
      changePct: 12.8,
      trend: 'up',
      spark: ordSpark.slice(-8),
      tintKey: 'info',
    },
    {
      key: 'revenue',
      label: 'Total Revenue',
      icon: 'cash-outline',
      value: money(totalRevenue),
      changePct: 18.5,
      trend: 'up',
      spark: revSpark.slice(-8),
      tintKey: 'success',
    },
    {
      key: 'revMonth',
      label: 'Revenue This Month',
      icon: 'calendar-outline',
      value: money(revenueThisMonth),
      changePct: 9.1,
      trend: 'up',
      spark: makeSeries(8, 540, 0.2, seedBase + 11),
      tintKey: 'success',
    },
    {
      key: 'revToday',
      label: 'Revenue Today',
      icon: 'today-outline',
      value: money(revenueToday),
      changePct: -3.4,
      trend: 'down',
      spark: makeSeries(8, 120, 0.3, seedBase + 12, false),
      tintKey: 'warning',
    },
    {
      key: 'customers',
      label: 'Total Customers',
      icon: 'people-outline',
      value: totalCustomers.toLocaleString('en-US'),
      changePct: 6.7,
      trend: 'up',
      spark: makeSeries(8, 60, 0.18, seedBase + 13),
      tintKey: 'info',
    },
    {
      key: 'active',
      label: 'Active Deliveries',
      icon: 'navigate-outline',
      value: String(activeDeliveries),
      changePct: 2.1,
      trend: 'up',
      spark: makeSeries(8, 6, 0.4, seedBase + 14),
      tintKey: 'info',
    },
    {
      key: 'delivered',
      label: 'Delivered Orders',
      icon: 'checkmark-done-outline',
      value: deliveredCount.toLocaleString('en-US'),
      changePct: 14.3,
      trend: 'up',
      spark: makeSeries(8, 30, 0.2, seedBase + 15),
      tintKey: 'success',
    },
    {
      key: 'pending',
      label: 'Pending Orders',
      icon: 'hourglass-outline',
      value: String(pendingCount),
      changePct: -5.2,
      trend: 'down',
      spark: makeSeries(8, 16, 0.3, seedBase + 16, false),
      tintKey: 'warning',
    },
    {
      key: 'cancelled',
      label: 'Cancelled Orders',
      icon: 'close-circle-outline',
      value: String(cancelledCount),
      changePct: -1.8,
      trend: 'down',
      spark: makeSeries(8, 9, 0.35, seedBase + 17, false),
      tintKey: 'danger',
    },
    {
      key: 'lowStock',
      label: 'Low Stock Products',
      icon: 'alert-circle-outline',
      value: String(lowStockItems.length),
      changePct: 3.0,
      trend: 'up',
      spark: makeSeries(8, 4, 0.3, seedBase + 18),
      tintKey: 'warning',
    },
    {
      key: 'outStock',
      label: 'Out of Stock',
      icon: 'ban-outline',
      value: String(outOfStock.length),
      changePct: -0.5,
      trend: 'down',
      spark: makeSeries(8, 3, 0.3, seedBase + 19, false),
      tintKey: 'danger',
    },
  ];

  // --- Revenue trend (multi-granularity) ----------------------------------
  const revenue = {
    labels: {
      daily: lastNDayLabels(7),
      weekly: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
      monthly: MONTHS.slice(0, 6),
      yearly: ['2022', '2023', '2024', '2025', '2026'],
    },
    series: {
      daily: makeSeries(7, 1200, 0.25, seedBase + 21),
      weekly: makeSeries(6, 8200, 0.18, seedBase + 22),
      monthly: makeSeries(6, 34000, 0.2, seedBase + 23),
      yearly: makeSeries(5, 320000, 0.15, seedBase + 24),
    },
  };

  // --- Orders trend -------------------------------------------------------
  const ordersTrend = {
    labels: {
      daily: lastNDayLabels(7),
      weekly: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
      monthly: MONTHS.slice(0, 6),
    },
    series: {
      daily: makeSeries(7, 38, 0.25, seedBase + 31),
      weekly: makeSeries(6, 220, 0.18, seedBase + 32),
      monthly: makeSeries(6, 940, 0.2, seedBase + 33),
    },
  };

  // --- Revenue vs orders (dual axis) --------------------------------------
  const rvoLabels = MONTHS.slice(0, 6);
  const revenueVsOrders = {
    labels: rvoLabels,
    revenue: revenue.series.monthly,
    orders: ordersTrend.series.monthly,
  };

  // --- Top selling products (derived from live products) ------------------
  const ranked = [...products]
    .map((p, i) => {
      const rnd = seeded(seedBase + 100 + i);
      const units = Math.round((520 - i * 14) * (0.7 + 0.6 * rnd()) * (cfg.scale > 1 ? 1.4 : 1));
      return {
        id: p.id,
        name: p.name,
        image: p.image,
        type: p.type,
        unit: p.unit,
        unitsSold: Math.max(20, units),
        revenue: Math.round(Math.max(20, units) * p.price),
        growth: Math.round((rnd() * 40 - 8) * 10) / 10,
      } as TopProduct;
    })
    .sort((a, b) => b.unitsSold - a.unitsSold);
  const topProducts = ranked.slice(0, 10);

  // --- Product sales distribution -----------------------------------------
  const vegUnits = ranked
    .filter((p) => products.find((x) => x.id === p.id)?.type === 'Vegetable')
    .reduce((a, p) => a + p.unitsSold, 0);
  const fruitUnits = ranked
    .filter((p) => products.find((x) => x.id === p.id)?.type === 'Fruit')
    .reduce((a, p) => a + p.unitsSold, 0);
  const packageUnits = Math.round((vegUnits + fruitUnits) * 0.22);
  const productDistribution = [
    { label: 'Vegetables', value: vegUnits, color: CHART_PALETTE[0] },
    { label: 'Fruits', value: fruitUnits, color: CHART_PALETTE[1] },
    { label: 'Packages', value: packageUnits, color: CHART_PALETTE[2] },
  ];

  // --- Category performance -----------------------------------------------
  const catNames = [
    'Fresh Vegetables',
    'Fresh Fruits',
    'Leafy Greens',
    'Root Vegetables',
    'Organic Picks',
    'Packages',
  ];
  const categories: CategoryPerf[] = catNames.map((name, i) => {
    const rnd = seeded(seedBase + 200 + i);
    const revenue = Math.round((9000 - i * 900) * (0.7 + 0.7 * rnd()) * cfg.scale + 1500);
    return {
      name,
      revenue,
      orders: Math.round(revenue / (38 + i * 4)),
      growth: Math.round((rnd() * 36 - 6) * 10) / 10,
    };
  });

  // --- Inventory ----------------------------------------------------------
  const byCategoryMap = new Map<string, number>();
  products.forEach((p) => {
    const key = p.type === 'Fruit' ? 'Fruits' : p.category;
    byCategoryMap.set(key, (byCategoryMap.get(key) ?? 0) + p.price * p.stock);
  });
  const inventory = {
    inStock: inStockCount,
    lowStock: lowStockItems.length,
    outOfStock: outOfStock.length,
    totalValue: inventoryValue,
    byCategory: [...byCategoryMap.entries()]
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value),
  };

  const lowStock: LowStockRow[] = [...lowStockItems, ...outOfStock]
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      threshold: 10,
      recommended: Math.max(20, 40 - p.stock),
    }));

  // --- Customers ----------------------------------------------------------
  const customers = {
    total: totalCustomers,
    growth: {
      labels: MONTHS.slice(0, 6),
      newCustomers: makeSeries(6, 60, 0.2, seedBase + 41),
      returning: makeSeries(6, 95, 0.15, seedBase + 42),
    },
    segmentation: [
      { label: 'New', value: 38, color: CHART_PALETTE[1] },
      { label: 'Returning', value: 44, color: CHART_PALETTE[0] },
      { label: 'Frequent', value: 18, color: CHART_PALETTE[3] },
    ],
    top: [
      { name: 'Alex Customer', orders: 42, spending: 1860 },
      { name: 'Priya Ramen', orders: 37, spending: 1520 },
      { name: 'Jean Dupont', orders: 33, spending: 1410 },
      { name: 'Mei Lin', orders: 28, spending: 1190 },
      { name: 'Omar Khan', orders: 24, spending: 980 },
    ] as TopCustomer[],
  };

  // --- Delivery -----------------------------------------------------------
  const delivery = {
    statusBreakdown: [
      { label: 'Preparing', value: 18, color: CHART_PALETTE[2] },
      { label: 'Ready', value: 12, color: CHART_PALETTE[3] },
      { label: 'Out for Delivery', value: 22, color: CHART_PALETTE[1] },
      { label: 'Nearby', value: 9, color: CHART_PALETTE[5] },
      { label: 'Delivered', value: 39, color: CHART_PALETTE[0] },
    ],
    avgTime: '32 min',
    fastest: '14 min',
    delayed: 7,
    onTimePct: 92,
    markers: [
      { id: 'd1', kind: 'driver' as const, x: 0.22, y: 0.3, label: 'Driver 1' },
      { id: 'd2', kind: 'driver' as const, x: 0.58, y: 0.55, label: 'Driver 2' },
      { id: 'd3', kind: 'driver' as const, x: 0.4, y: 0.72, label: 'Driver 3' },
      { id: 'c1', kind: 'customer' as const, x: 0.78, y: 0.24, label: 'Order 1048' },
      { id: 'c2', kind: 'customer' as const, x: 0.3, y: 0.5, label: 'Order 1042' },
      { id: 'c3', kind: 'customer' as const, x: 0.66, y: 0.82, label: 'Order 1051' },
    ],
  };

  // --- Packages -----------------------------------------------------------
  const pkgNames = [
    'Weekly Essentials',
    'Healthy Greens',
    'Family Cooking',
    'Fruit Basket',
    'Soup Vegetables',
    'Mixed Fresh',
  ];
  const ranking: PackageRank[] = pkgNames
    .map((name, i) => {
      const rnd = seeded(seedBase + 300 + i);
      const ordersN = Math.round((140 - i * 16) * (0.7 + 0.6 * rnd()) * cfg.scale + 20);
      return { id: `pk${i + 1}`, name, orders: ordersN, revenue: Math.round(ordersN * (12 + i * 2)) };
    })
    .sort((a, b) => b.orders - a.orders);
  const packages = {
    ranking,
    mostOrdered: ranking[0].name,
    leastOrdered: ranking[ranking.length - 1].name,
    revenue: ranking.reduce((a, p) => a + p.revenue, 0),
  };

  // --- Forecast -----------------------------------------------------------
  const fActual = makeSeries(6, 34000, 0.18, seedBase + 51);
  const lastActual = fActual[fActual.length - 1];
  const fProjected = makeSeries(4, lastActual, 0.12, seedBase + 52).map((v, i) =>
    Math.round(lastActual * (1.06 + i * 0.05) * (0.96 + (v / lastActual) * 0.08)),
  );
  const forecast = {
    labels: [...MONTHS.slice(0, 6), 'Jul', 'Aug', 'Sep', 'Oct'],
    actual: [...fActual, ...Array(4).fill(null)] as (number | null)[],
    projected: [...Array(5).fill(null), lastActual, ...fProjected] as (number | null)[],
    nextWeekRevenue: Math.round(lastActual / 4 * 1.08),
    nextMonthRevenue: fProjected[0],
    nextMonthOrders: Math.round(fProjected[0] / 36),
  };

  return {
    rangeLabel,
    kpis,
    revenue,
    orders: ordersTrend,
    revenueVsOrders,
    topProducts,
    productDistribution,
    categories,
    inventory,
    lowStock,
    customers,
    delivery,
    packages,
    forecast,
  };
}

// --- small formatting helpers ----------------------------------------------

// Compact money for KPI cards / chart labels (e.g. Rs 1.2k, Rs 184k).
export function money(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `Rs ${(amount / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `Rs ${(amount / 1_000).toFixed(1)}k`;
  return `Rs ${Math.round(amount)}`;
}

function lastNDayLabels(n: number): string[] {
  const out: string[] = [];
  const today = new Date('2026-06-05');
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(WEEKDAYS[(d.getDay() + 6) % 7]);
  }
  return out;
}

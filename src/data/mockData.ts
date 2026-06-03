import {
  Product,
  ProductPackage,
  Order,
  Category,
  AppUser,
  DeliveryStep,
} from '../types';

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const categories: Category[] = [
  { id: 'c1', name: 'Fresh Vegetables', icon: 'nutrition-outline', filterType: 'Vegetable' },
  { id: 'c2', name: 'Fresh Fruits', icon: 'leaf-outline', filterType: 'Fruit' },
  { id: 'c3', name: 'Leafy Greens', icon: 'flower-outline', filterType: 'Vegetable', categoryKey: 'Leafy Greens' },
  { id: 'c4', name: 'Root Vegetables', icon: 'git-branch-outline', filterType: 'Vegetable', categoryKey: 'Root Vegetables' },
  { id: 'c5', name: 'Organic Picks', icon: 'sparkles-outline', filterType: 'all', categoryKey: 'Organic' },
  { id: 'c6', name: 'Packages', icon: 'cube-outline', filterType: 'package' },
];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export const products: Product[] = [
  // Vegetables
  { id: 'p1', name: 'Tomato', type: 'Vegetable', category: 'Fruiting Vegetables', price: 1.8, unit: 'kg', description: 'Juicy ripe red tomatoes, perfect for salads and sauces.', stock: 120, inStock: true, image: null, featured: true, popular: true },
  { id: 'p2', name: 'Potato', type: 'Vegetable', category: 'Root Vegetables', price: 1.2, unit: 'kg', description: 'Versatile starchy potatoes for frying, mashing and roasting.', stock: 200, inStock: true, image: null, popular: true },
  { id: 'p3', name: 'Onion', type: 'Vegetable', category: 'Root Vegetables', price: 1.0, unit: 'kg', description: 'Fresh yellow onions with a sharp, savoury flavour.', stock: 180, inStock: true, image: null },
  { id: 'p4', name: 'Carrot', type: 'Vegetable', category: 'Root Vegetables', price: 1.5, unit: 'kg', description: 'Crunchy sweet carrots, rich in beta-carotene.', stock: 90, inStock: true, image: null, featured: true },
  { id: 'p5', name: 'Cabbage', type: 'Vegetable', category: 'Leafy Greens', price: 0.9, unit: 'piece', description: 'Crisp green cabbage heads, great for stir-fries and slaws.', stock: 60, inStock: true, image: null },
  { id: 'p6', name: 'Lettuce', type: 'Vegetable', category: 'Leafy Greens', price: 1.1, unit: 'piece', description: 'Fresh crunchy lettuce for salads and wraps.', stock: 40, inStock: true, image: null },
  { id: 'p7', name: 'Spinach', type: 'Vegetable', category: 'Leafy Greens', price: 1.4, unit: 'bunch', description: 'Tender baby spinach leaves packed with iron.', stock: 8, inStock: true, image: null, popular: true },
  { id: 'p8', name: 'Cucumber', type: 'Vegetable', category: 'Fruiting Vegetables', price: 1.3, unit: 'kg', description: 'Cool refreshing cucumbers, hydrating and crisp.', stock: 75, inStock: true, image: null },
  { id: 'p9', name: 'Eggplant', type: 'Vegetable', category: 'Fruiting Vegetables', price: 1.7, unit: 'kg', description: 'Glossy purple eggplants, ideal for grilling and curries.', stock: 50, inStock: true, image: null },
  { id: 'p10', name: 'Broccoli', type: 'Vegetable', category: 'Organic', price: 2.5, unit: 'piece', description: 'Organic broccoli florets, nutrient dense and tasty.', stock: 5, inStock: true, image: null, featured: true },

  // Fruits
  { id: 'p11', name: 'Apple', type: 'Fruit', category: 'Organic', price: 2.2, unit: 'kg', description: 'Crisp sweet apples, freshly harvested.', stock: 140, inStock: true, image: null, featured: true, popular: true },
  { id: 'p12', name: 'Banana', type: 'Fruit', category: 'Tropical', price: 1.6, unit: 'kg', description: 'Ripe bananas full of natural energy.', stock: 160, inStock: true, image: null, popular: true },
  { id: 'p13', name: 'Orange', type: 'Fruit', category: 'Citrus', price: 1.9, unit: 'kg', description: 'Juicy oranges bursting with vitamin C.', stock: 110, inStock: true, image: null },
  { id: 'p14', name: 'Mango', type: 'Fruit', category: 'Tropical', price: 3.0, unit: 'piece', description: 'Sweet sun-ripened mangoes.', stock: 70, inStock: true, image: null, featured: true },
  { id: 'p15', name: 'Pineapple', type: 'Fruit', category: 'Tropical', price: 2.8, unit: 'piece', description: 'Tangy tropical pineapple, ready to slice.', stock: 30, inStock: true, image: null },
  { id: 'p16', name: 'Grapes', type: 'Fruit', category: 'Organic', price: 3.2, unit: 'kg', description: 'Seedless green grapes, sweet and crunchy.', stock: 0, inStock: false, image: null },
  { id: 'p17', name: 'Watermelon', type: 'Fruit', category: 'Melons', price: 4.5, unit: 'piece', description: 'Refreshing whole watermelon, perfect for summer.', stock: 25, inStock: true, image: null },
  { id: 'p18', name: 'Papaya', type: 'Fruit', category: 'Tropical', price: 2.4, unit: 'piece', description: 'Soft ripe papaya, rich and sweet.', stock: 35, inStock: true, image: null },
  { id: 'p19', name: 'Strawberry', type: 'Fruit', category: 'Berries', price: 3.8, unit: 'pack', description: 'Fragrant red strawberries in a 250g pack.', stock: 6, inStock: true, image: null, popular: true },
  { id: 'p20', name: 'Pear', type: 'Fruit', category: 'Organic', price: 2.6, unit: 'kg', description: 'Smooth juicy pears with a delicate sweetness.', stock: 80, inStock: true, image: null },
];

// ---------------------------------------------------------------------------
// Ready-made packages
// ---------------------------------------------------------------------------
export const packages: ProductPackage[] = [
  {
    id: 'pk1',
    name: 'Weekly Essentials Pack',
    description: 'Everything you need for a week of home cooking.',
    size: 'Medium',
    price: 14.9,
    image: null,
    popular: true,
    items: [
      { productId: 'p1', quantity: 1 },
      { productId: 'p2', quantity: 2 },
      { productId: 'p3', quantity: 1 },
      { productId: 'p4', quantity: 1 },
    ],
  },
  {
    id: 'pk2',
    name: 'Healthy Greens Pack',
    description: 'A bundle of leafy greens for clean eating.',
    size: 'Small',
    price: 9.5,
    image: null,
    popular: true,
    items: [
      { productId: 'p5', quantity: 1 },
      { productId: 'p6', quantity: 1 },
      { productId: 'p7', quantity: 2 },
    ],
  },
  {
    id: 'pk3',
    name: 'Family Cooking Pack',
    description: 'A large mix of staples for the whole family.',
    size: 'Family Pack',
    price: 24.0,
    image: null,
    items: [
      { productId: 'p2', quantity: 3 },
      { productId: 'p3', quantity: 2 },
      { productId: 'p1', quantity: 2 },
      { productId: 'p9', quantity: 1 },
      { productId: 'p4', quantity: 2 },
    ],
  },
  {
    id: 'pk4',
    name: 'Fruit Basket Pack',
    description: 'A colourful assortment of fresh seasonal fruit.',
    size: 'Medium',
    price: 18.5,
    image: null,
    popular: true,
    items: [
      { productId: 'p11', quantity: 1 },
      { productId: 'p12', quantity: 1 },
      { productId: 'p13', quantity: 1 },
      { productId: 'p14', quantity: 2 },
    ],
  },
  {
    id: 'pk5',
    name: 'Soup Vegetables Pack',
    description: 'Hand-picked vegetables ideal for hearty soups.',
    size: 'Small',
    price: 8.9,
    image: null,
    items: [
      { productId: 'p4', quantity: 1 },
      { productId: 'p3', quantity: 1 },
      { productId: 'p1', quantity: 1 },
      { productId: 'p5', quantity: 1 },
    ],
  },
  {
    id: 'pk6',
    name: 'Mixed Fresh Pack',
    description: 'A balanced mix of vegetables and fruits.',
    size: 'Large',
    price: 21.0,
    image: null,
    items: [
      { productId: 'p1', quantity: 1 },
      { productId: 'p8', quantity: 1 },
      { productId: 'p11', quantity: 1 },
      { productId: 'p12', quantity: 1 },
      { productId: 'p20', quantity: 1 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Users (mock auth)
// ---------------------------------------------------------------------------
export const users: AppUser[] = [
  {
    id: 'u1',
    name: 'Alex Customer',
    email: 'customer@demo.app',
    phone: '+230 5 123 4567',
    role: 'customer',
    addresses: ['12 Garden Lane, Port Louis', 'Office 4, Ebene Cyber City'],
  },
  {
    id: 'u2',
    name: 'Sam Admin',
    email: 'admin@demo.app',
    phone: '+230 5 987 6543',
    role: 'admin',
    addresses: ['Warehouse 1, Industrial Zone'],
  },
];

// ---------------------------------------------------------------------------
// Delivery steps helper
// ---------------------------------------------------------------------------
export const buildDeliverySteps = (currentIndex: number): DeliveryStep[] => {
  const base: { label: string; status: DeliveryStep['status'] }[] = [
    { label: 'Order placed', status: 'Order Placed' },
    { label: 'Order confirmed', status: 'Order Confirmed' },
    { label: 'Preparing your items', status: 'Preparing Order' },
    { label: 'Out for delivery', status: 'Out for Delivery' },
    { label: 'Arriving soon', status: 'Nearby' },
    { label: 'Delivered', status: 'Delivered' },
  ];
  return base.map((s, i) => ({ ...s, done: i <= currentIndex }));
};

// ---------------------------------------------------------------------------
// Orders (with live tracking data)
// ---------------------------------------------------------------------------
export const orders: Order[] = [
  {
    orderId: 'ORD-1048',
    customerName: 'Alex Customer',
    customerPhone: '+230 5 123 4567',
    deliveryAddress: '12 Garden Lane, Port Louis',
    items: [
      { name: 'Tomato', quantity: 2, unitLabel: 'kg', price: 1.8, kind: 'product' },
      { name: 'Apple', quantity: 1, unitLabel: 'kg', price: 2.2, kind: 'product' },
      { name: 'Weekly Essentials Pack', quantity: 1, unitLabel: 'pack', price: 14.9, kind: 'package' },
    ],
    totalAmount: 22.5,
    paymentMethod: 'Cash on Delivery',
    orderStatus: 'Out for Delivery',
    deliveryStatus: 'Out for Delivery',
    driverName: 'Driver Placeholder',
    driverPhone: '+230 5 000 0000',
    estimatedDeliveryTime: '25 min',
    date: '2026-06-03',
    customerLocation: { latitude: 0.82, longitude: 0.5 },
    driverLocation: { latitude: 0.2, longitude: 0.18 },
    progressPercentage: 55,
    deliverySteps: buildDeliverySteps(3),
  },
  {
    orderId: 'ORD-1042',
    customerName: 'Alex Customer',
    customerPhone: '+230 5 123 4567',
    deliveryAddress: 'Office 4, Ebene Cyber City',
    items: [
      { name: 'Banana', quantity: 2, unitLabel: 'kg', price: 1.6, kind: 'product' },
      { name: 'Fruit Basket Pack', quantity: 1, unitLabel: 'pack', price: 18.5, kind: 'package' },
    ],
    totalAmount: 21.7,
    paymentMethod: 'Card',
    orderStatus: 'Preparing',
    deliveryStatus: 'Preparing Order',
    driverName: 'Driver Placeholder',
    driverPhone: '+230 5 000 0000',
    estimatedDeliveryTime: '45 min',
    date: '2026-06-03',
    customerLocation: { latitude: 0.82, longitude: 0.5 },
    driverLocation: { latitude: 0.1, longitude: 0.12 },
    progressPercentage: 25,
    deliverySteps: buildDeliverySteps(2),
  },
  {
    orderId: 'ORD-1031',
    customerName: 'Alex Customer',
    customerPhone: '+230 5 123 4567',
    deliveryAddress: '12 Garden Lane, Port Louis',
    items: [
      { name: 'Mango', quantity: 3, unitLabel: 'piece', price: 3.0, kind: 'product' },
      { name: 'Carrot', quantity: 2, unitLabel: 'kg', price: 1.5, kind: 'product' },
    ],
    totalAmount: 12.0,
    paymentMethod: 'Mobile Payment',
    orderStatus: 'Delivered',
    deliveryStatus: 'Delivered',
    driverName: 'Driver Placeholder',
    driverPhone: '+230 5 000 0000',
    estimatedDeliveryTime: 'Delivered',
    date: '2026-05-28',
    customerLocation: { latitude: 0.82, longitude: 0.5 },
    driverLocation: { latitude: 0.82, longitude: 0.5 },
    progressPercentage: 100,
    deliverySteps: buildDeliverySteps(5),
  },
];

// Ordered list of delivery statuses for stepping the simulation / admin updates.
export const deliveryStatusFlow: Order['deliveryStatus'][] = [
  'Order Placed',
  'Order Confirmed',
  'Preparing Order',
  'Ready for Pickup',
  'Out for Delivery',
  'Nearby',
  'Delivered',
];

export const orderStatusFlow: Order['orderStatus'][] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready for Pickup',
  'Out for Delivery',
  'Nearby',
  'Delivered',
  'Cancelled',
];

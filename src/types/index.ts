// Central type definitions for the whole app.

export type ProductType = 'Vegetable' | 'Fruit';

export type Unit = 'kg' | 'piece' | 'bunch' | 'pack';

export type PackageSize = 'Small' | 'Medium' | 'Large' | 'Family Pack';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  category: string;
  price: number;
  unit: Unit;
  description: string;
  stock: number;
  inStock: boolean;
  image?: string | null; // local uri or null -> placeholder
  featured?: boolean;
  popular?: boolean;
}

export interface PackageItem {
  productId: string;
  quantity: number;
}

export interface ProductPackage {
  id: string;
  name: string;
  description: string;
  size: PackageSize;
  items: PackageItem[];
  price: number;
  image?: string | null;
  popular?: boolean;
  custom?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Ionicons name
  filterType?: ProductType | 'all' | 'package';
  categoryKey?: string;
}

// A line in the cart can be either a product or a package.
export interface CartLine {
  id: string; // unique line id
  kind: 'product' | 'package';
  refId: string; // product id or package id
  name: string;
  unitLabel: string;
  price: number; // price per unit
  quantity: number;
  image?: string | null;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Nearby'
  | 'Delivered'
  | 'Cancelled';

export type DeliveryStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Preparing Order'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Nearby'
  | 'Delivered';

export interface DeliveryStep {
  label: string;
  status: DeliveryStatus;
  done: boolean;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  unitLabel: string;
  price: number;
  kind: 'product' | 'package';
}

export interface Order {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'Card' | 'Mobile Payment';
  orderStatus: OrderStatus;
  deliveryStatus: DeliveryStatus;
  driverName: string;
  driverPhone: string;
  estimatedDeliveryTime: string;
  date: string;
  customerLocation: GeoPoint;
  driverLocation: GeoPoint;
  progressPercentage: number; // 0 - 100
  deliverySteps: DeliveryStep[];
}

export type UserRole = 'customer' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  addresses: string[];
}

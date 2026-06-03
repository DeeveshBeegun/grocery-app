import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Product,
  ProductPackage,
  Order,
  OrderStatus,
  DeliveryStatus,
} from '../types';
import {
  products as seedProducts,
  packages as seedPackages,
  orders as seedOrders,
  buildDeliverySteps,
  deliveryStatusFlow,
} from '../data/mockData';

interface DataContextValue {
  products: Product[];
  packages: ProductPackage[];
  orders: Order[];
  // product admin
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  // package admin
  addPackage: (p: ProductPackage) => void;
  updatePackage: (p: ProductPackage) => void;
  deletePackage: (id: string) => void;
  // orders
  addOrder: (o: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateDeliveryStatus: (orderId: string, status: DeliveryStatus) => void;
  getOrder: (orderId: string) => Order | undefined;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const statusIndex = (s: DeliveryStatus) => deliveryStatusFlow.indexOf(s);

// keep order + delivery status loosely in sync
const deliveryToOrderStatus = (d: DeliveryStatus): OrderStatus => {
  switch (d) {
    case 'Order Placed': return 'Pending';
    case 'Order Confirmed': return 'Confirmed';
    case 'Preparing Order': return 'Preparing';
    case 'Ready for Pickup': return 'Ready for Pickup';
    case 'Out for Delivery': return 'Out for Delivery';
    case 'Nearby': return 'Nearby';
    case 'Delivered': return 'Delivered';
    default: return 'Pending';
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [packages, setPackages] = useState<ProductPackage[]>(seedPackages);
  const [orders, setOrders] = useState<Order[]>(seedOrders);

  const addProduct = useCallback((p: Product) => {
    setProducts((prev) => [p, ...prev]);
  }, []);
  const updateProduct = useCallback((p: Product) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  }, []);
  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addPackage = useCallback((p: ProductPackage) => {
    setPackages((prev) => [p, ...prev]);
  }, []);
  const updatePackage = useCallback((p: ProductPackage) => {
    setPackages((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  }, []);
  const deletePackage = useCallback((id: string) => {
    setPackages((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addOrder = useCallback((o: Order) => {
    setOrders((prev) => [o, ...prev]);
  }, []);

  const updateDeliveryStatus = useCallback((orderId: string, status: DeliveryStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId !== orderId) return o;
        const idx = statusIndex(status);
        const progress = Math.round((idx / (deliveryStatusFlow.length - 1)) * 100);
        // move driver closer to customer as progress increases
        const t = progress / 100;
        const driverLocation = {
          latitude: o.driverLocation.latitude + (o.customerLocation.latitude - o.driverLocation.latitude) * t * 0.4,
          longitude: o.driverLocation.longitude + (o.customerLocation.longitude - o.driverLocation.longitude) * t * 0.4,
        };
        return {
          ...o,
          deliveryStatus: status,
          orderStatus: deliveryToOrderStatus(status),
          progressPercentage: progress,
          driverLocation,
          deliverySteps: buildDeliverySteps(Math.min(idx, 5)),
          estimatedDeliveryTime: status === 'Delivered' ? 'Delivered' : o.estimatedDeliveryTime,
        };
      })
    );
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, orderStatus: status } : o))
    );
  }, []);

  const getOrder = useCallback(
    (orderId: string) => orders.find((o) => o.orderId === orderId),
    [orders]
  );

  return (
    <DataContext.Provider
      value={{
        products,
        packages,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        addPackage,
        updatePackage,
        deletePackage,
        addOrder,
        updateOrderStatus,
        updateDeliveryStatus,
        getOrder,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextValue => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

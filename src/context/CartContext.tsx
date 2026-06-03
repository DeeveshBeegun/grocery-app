import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartLine, Product, ProductPackage } from '../types';

const STORAGE_KEY = '@app_cart';
export const DELIVERY_FEE = 2.5;

interface CartContextValue {
  items: CartLine[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addProduct: (product: Product, quantity?: number) => void;
  addPackage: (pkg: ProductPackage, quantity?: number) => void;
  addCustomPackage: (name: string, price: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const uid = () => Math.random().toString(36).slice(2, 10);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setItems(JSON.parse(stored));
      } catch {
        // ignore
      }
    })();
  }, []);

  const persist = (next: CartLine[]) => {
    setItems(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const addProduct = (product: Product, quantity = 1) => {
    const existing = items.find((i) => i.kind === 'product' && i.refId === product.id);
    if (existing) {
      persist(items.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i)));
      return;
    }
    persist([
      ...items,
      {
        id: uid(),
        kind: 'product',
        refId: product.id,
        name: product.name,
        unitLabel: product.unit,
        price: product.price,
        quantity,
        image: product.image ?? null,
      },
    ]);
  };

  const addPackage = (pkg: ProductPackage, quantity = 1) => {
    const existing = items.find((i) => i.kind === 'package' && i.refId === pkg.id);
    if (existing) {
      persist(items.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i)));
      return;
    }
    persist([
      ...items,
      {
        id: uid(),
        kind: 'package',
        refId: pkg.id,
        name: pkg.name,
        unitLabel: 'pack',
        price: pkg.price,
        quantity,
        image: pkg.image ?? null,
      },
    ]);
  };

  const addCustomPackage = (name: string, price: number) => {
    persist([
      ...items,
      {
        id: uid(),
        kind: 'package',
        refId: 'custom-' + uid(),
        name,
        unitLabel: 'pack',
        price,
        quantity: 1,
        image: null,
      },
    ]);
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      persist(items.filter((i) => i.id !== lineId));
      return;
    }
    persist(items.map((i) => (i.id === lineId ? { ...i, quantity } : i)));
  };

  const removeItem = (lineId: string) => persist(items.filter((i) => i.id !== lineId));

  const clearCart = () => persist([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        deliveryFee,
        total,
        addProduct,
        addPackage,
        addCustomPackage,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

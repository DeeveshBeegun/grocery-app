import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SideMenu from '../components/SideMenu';

import HomeScreen from '../screens/customer/HomeScreen';
import ProductsScreen from '../screens/customer/ProductsScreen';
import ProductDetailsScreen from '../screens/customer/ProductDetailsScreen';
import BuildPackageScreen from '../screens/customer/BuildPackageScreen';
import CartScreen from '../screens/customer/CartScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import OrderConfirmationScreen from '../screens/customer/OrderConfirmationScreen';
import DeliveryTrackingScreen from '../screens/customer/DeliveryTrackingScreen';
import MyOrdersScreen from '../screens/customer/MyOrdersScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import ContactUsScreen from '../screens/customer/ContactUsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const stackOpts = { headerShown: false } as const;

const HomeStack = () => (
  <Stack.Navigator screenOptions={stackOpts}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    <Stack.Screen name="DeliveryTracking" component={DeliveryTrackingScreen} />
  </Stack.Navigator>
);

const ProductsStack = () => (
  <Stack.Navigator screenOptions={stackOpts}>
    <Stack.Screen name="ProductsMain" component={ProductsScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </Stack.Navigator>
);

const CartStack = () => (
  <Stack.Navigator screenOptions={stackOpts}>
    <Stack.Screen name="CartMain" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
    <Stack.Screen name="DeliveryTracking" component={DeliveryTrackingScreen} />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator screenOptions={stackOpts}>
    <Stack.Screen name="OrdersMain" component={MyOrdersScreen} />
    <Stack.Screen name="DeliveryTracking" component={DeliveryTrackingScreen} />
  </Stack.Navigator>
);

const CustomerDrawer: React.FC = () => (
  <Drawer.Navigator
    drawerContent={(props) => <SideMenu {...props} />}
    screenOptions={{ headerShown: false, drawerType: 'front', swipeEdgeWidth: 80 }}
  >
    <Drawer.Screen name="Home" component={HomeStack} />
    <Drawer.Screen name="Vegetables & Fruits" component={ProductsStack} />
    <Drawer.Screen name="Build Package" component={BuildPackageScreen} />
    <Drawer.Screen name="My Cart" component={CartStack} />
    <Drawer.Screen name="My Orders" component={OrdersStack} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
);

export default CustomerDrawer;

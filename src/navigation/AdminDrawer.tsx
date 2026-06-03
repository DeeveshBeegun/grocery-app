import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SideMenu from '../components/SideMenu';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageProductsScreen from '../screens/admin/ManageProductsScreen';
import AddEditProductScreen from '../screens/admin/AddEditProductScreen';
import ManageOrdersScreen from '../screens/admin/ManageOrdersScreen';
import AdminOrderDetailsScreen from '../screens/admin/AdminOrderDetailsScreen';
import ManagePackagesScreen from '../screens/admin/ManagePackagesScreen';
import AddEditPackageScreen from '../screens/admin/AddEditPackageScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const stackOpts = { headerShown: false } as const;

const ProductsStack = () => (
  <Stack.Navigator screenOptions={stackOpts}>
    <Stack.Screen name="ManageProductsMain" component={ManageProductsScreen} />
    <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} />
  </Stack.Navigator>
);

const AddProductStack = () => (
  <Stack.Navigator screenOptions={stackOpts}>
    <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator screenOptions={stackOpts}>
    <Stack.Screen name="ManageOrdersMain" component={ManageOrdersScreen} />
    <Stack.Screen name="AdminOrderDetails" component={AdminOrderDetailsScreen} />
  </Stack.Navigator>
);

const PackagesStack = () => (
  <Stack.Navigator screenOptions={stackOpts}>
    <Stack.Screen name="ManagePackagesMain" component={ManagePackagesScreen} />
    <Stack.Screen name="AddEditPackage" component={AddEditPackageScreen} />
  </Stack.Navigator>
);

const AdminDrawer: React.FC = () => (
  <Drawer.Navigator
    drawerContent={(props) => <SideMenu {...props} />}
    screenOptions={{ headerShown: false, drawerType: 'front', swipeEdgeWidth: 80 }}
  >
    <Drawer.Screen name="Admin Dashboard" component={AdminDashboardScreen} />
    <Drawer.Screen name="Manage Products" component={ProductsStack} />
    <Drawer.Screen name="Add Product" component={AddProductStack} />
    <Drawer.Screen name="Manage Orders" component={OrdersStack} />
    <Drawer.Screen name="Manage Packages" component={PackagesStack} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
);

export default AdminDrawer;

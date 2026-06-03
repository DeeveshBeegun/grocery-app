# Grocery Ordering App (Vegetables & Fruits)

A complete **frontend-only** grocery ordering app built with **React Native + Expo + TypeScript**. It runs on **Android, iOS, and Web**, uses **mock data only** (no backend), and includes both a **customer** experience and an **admin** experience.

> The app intentionally has **no brand name**. The logo is a placeholder that simply reads **"LOGO"** and is designed to be swapped for a real image later (see below).

---

## Features

### Customer
- Mock login (choose **Customer** or **Admin** — no password)
- Home screen with search, promo banner, categories, featured products, popular packages, and a live **active order** card
- Browse / search / filter / sort vegetables & fruits
- Product details with quantity selector
- **Build Your Package** — create a custom box, plus ready-made packages
- Cart with quantity controls, delivery fee, and totals
- Checkout (address, phone, delivery date, time slot, payment method)
- Order confirmation
- **Simulated live delivery tracking** — map-style view with a moving driver marker, progress bar, ETA, driver info, and a delivery timeline that advances automatically every few seconds
- My Orders (active + past) with reorder and track
- Profile (editable) and Contact Us
- **Settings** — pick any app colour with a custom colour picker + hex input, with live preview; saved on-device

### Admin
- Dashboard with overview cards (total products, total orders, pending, delivered, low stock, active deliveries) and quick actions
- Manage Products (add / edit / delete) with photo upload
- Add / Edit Product form (type, category, unit, price, stock, availability toggle, image)
- Manage Orders + Order Details with **order & delivery status updates that flow straight through to the customer's tracking screen** (shared state)
- Manage Packages (add / edit / delete) with multi-item selection and per-item quantities

The selected app colour drives buttons, header accents, the active side-menu item, highlights, and more — everywhere in the app, for both roles.

---

## Requirements

- **Node.js 18 or newer** (LTS recommended)
- npm (bundled with Node)
- For phones: the **Expo Go** app (iOS App Store / Google Play), or an Android emulator / iOS simulator

---

## Run it

```bash
# 1. Install dependencies
npm install

# 2. (Recommended) align native dependency versions with your Expo SDK
npx expo install --fix

# 3. Start the dev server
npx expo start
```

Then:
- Press **w** to open in a **web** browser
- Press **a** to open on **Android** (emulator or connected device)
- Press **i** to open on **iOS** (macOS + Xcode simulator)
- Or scan the QR code with **Expo Go** on your phone

> If web doesn't open automatically you can also run `npx expo start --web`.

---

## Logging in

This is **mock authentication** — there are no real accounts.

On the login screen, tap **Continue as Customer** or **Continue as Admin**. The app switches to the matching experience immediately. Use **Logout** in the side menu to return to the login screen.

---

## Replacing the LOGO placeholder

The logo lives in **`src/components/LogoPlaceholder.tsx`**. It currently renders a dashed box that says `LOGO`. To use a real logo, drop your image into the project (e.g. `assets/logo.png`) and replace the placeholder's inner content with an `Image`:

```tsx
import { Image } from 'react-native';
// ...
<Image
  source={require('../../assets/logo.png')}
  style={{ width: 40, height: 40, borderRadius: 8 }}
  resizeMode="contain"
/>
```

The component is used in the header and side menu, so updating it once changes the logo everywhere.

---

## Changing the app colour

Open the side menu → **Settings**. Use the colour picker (hue dots + shade strip + preset swatches) or type a hex code such as `#2E7D32`, watch the live preview, then **Save**. **Reset** restores the default green. Your choice persists across restarts via `AsyncStorage`.

---

## How the simulated live tracking works

There is no backend, so tracking is simulated locally. On the **Delivery Tracking** screen a timer advances the order's delivery status step by step (Order Placed → Order Confirmed → Preparing → Ready for Pickup → Out for Delivery → Nearby → Delivered). As progress increases, the driver marker moves toward the customer marker, the progress bar fills, and the timeline checks off steps. You can pause/resume the live updates.

Because product, order, and tracking state is shared via React Context, when an **admin** updates an order's delivery status in **Manage Orders → Order Details**, the change is reflected on the **customer's** tracking screen too.

---

## Project structure

```
grocery-app/
├── App.tsx                     # Providers + root navigator
├── index.ts                    # Entry point (registerRootComponent)
├── app.json                    # Expo config
├── babel.config.js
├── tsconfig.json
├── package.json
└── src/
    ├── theme/
    │   └── ThemeContext.tsx     # Dynamic colour theme + persistence
    ├── context/
    │   ├── AuthContext.tsx      # Mock auth (customer/admin)
    │   ├── DataContext.tsx      # Products, packages, orders + status updates
    │   └── CartContext.tsx      # Cart state + persistence
    ├── data/
    │   └── mockData.ts          # Mock products, packages, orders, users, categories
    ├── types/
    │   └── index.ts             # Shared TypeScript types
    ├── components/              # Header, SideMenu, ProductCard, cards, forms, pickers, etc.
    ├── navigation/
    │   ├── RootNavigator.tsx    # Auth switch
    │   ├── CustomerDrawer.tsx   # Customer drawer + nested stacks
    │   └── AdminDrawer.tsx      # Admin drawer + nested stacks
    └── screens/
        ├── LoginScreen.tsx
        ├── SettingsScreen.tsx   # Shared by both roles
        ├── customer/            # Home, Products, Details, Build, Cart, Checkout, Confirmation, Tracking, Orders, Profile, Contact
        └── admin/               # Dashboard, Manage/Add-Edit Products, Manage Orders + Details, Manage/Add-Edit Packages
```

---

## Notes

- All data is mock data held in memory (cart, colour, and the mock user are persisted with `AsyncStorage`). Restarting the bundler resets products/orders to the seed data.
- Image uploads use `expo-image-picker`. On mobile they come from the gallery; on web, from a file dialog. Selected images are kept in local state (no upload server).
- This is a UI/frontend project — wiring it to a real backend would mean replacing the Context data sources with API calls.

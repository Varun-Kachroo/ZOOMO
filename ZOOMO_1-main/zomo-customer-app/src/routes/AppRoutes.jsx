import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import MainLayout from "../layout/MainLayout";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Restaurants from "../pages/Restaurants";
import Restaurant from "../pages/Restaurant";
import Bag from "../pages/Bag";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import MyAddresses from "../pages/MyAddresses";
import AccountSettings from "../pages/AccountSettings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page (NO layout for hero effects) */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Legal — public, no layout (has its own header) */}
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Pages wrapped inside MainLayout */}
      <Route
        path="/restaurants"
        element={
          <MainLayout>
            <Restaurants />
          </MainLayout>
        }
      />

      <Route
        path="/restaurant/:id"
        element={
          <MainLayout>
            <Restaurant />
          </MainLayout>
        }
      />

      {/* ✅ Bag — replaces the old single-restaurant Cart page.
          /cart is kept as an alias so any old links still work. */}
      <Route
        path="/bag"
        element={
          <MainLayout>
            <Bag />
          </MainLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <MainLayout>
            <Bag />
          </MainLayout>
        }
      />

      {/* ✅ Checkout now takes a restaurantId — chosen from the Bag page,
          since the bag can hold items from several restaurants at once. */}
      <Route
        path="/checkout/:restaurantId"
        element={
          <MainLayout>
            <Checkout />
          </MainLayout>
        }
      />

      <Route
        path="/orders"
        element={
          <MainLayout>
            <Orders />
          </MainLayout>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <MainLayout>
            <OrderDetails />
          </MainLayout>
        }
      />

      {/* ✅ New — reached from the profile drawer ("You" tab) */}
      <Route
        path="/addresses"
        element={
          <MainLayout>
            <MyAddresses />
          </MainLayout>
        }
      />

      <Route
        path="/account"
        element={
          <MainLayout>
            <AccountSettings />
          </MainLayout>
        }
      />
    </Routes>
  );
}

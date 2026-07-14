import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterPartner from "./pages/RegisterPartner";
import ProductList from "./pages/ProductList";
import Orders from "./pages/Orders";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Profile from "./pages/customer/Profile";
import Settings from "./pages/customer/Settings";
import Addresses from "./pages/customer/Addresses";
import PaymentMethods from "./pages/customer/PaymentMethods";
import Support from "./pages/customer/Support";
import StoreDetail from "./pages/store/StoreDetail";
import CartCheckout from "./pages/store/CartCheckout";
import OrderConfirmation from "./pages/store/OrderConfirmation";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import MyItems from "./pages/partner/MyItems";
import PartnerOrders from "./pages/partner/PartnerOrders";
import StoreProfile from "./pages/partner/StoreProfile";
import PartnerSettings from "./pages/partner/PartnerSettings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/register-partner" element={<RegisterPartner />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/store/:partnerId" element={<StoreDetail />} />

      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/cart" element={<CartCheckout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/support" element={<Support />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["partner"]} />}>
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/partner/items" element={<MyItems />} />
        <Route path="/partner/orders" element={<PartnerOrders />} />
        <Route path="/partner/profile" element={<StoreProfile />} />
        <Route path="/partner/settings" element={<PartnerSettings />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

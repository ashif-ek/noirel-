import "./App.css";
import Login from "./auth/login";
import Register from "./auth/register";

import Home from "./modules/user/pages/home";
import Carts from "./modules/user/pages/carts";
import Products from "./modules/user/pages/products";
import Orders from "./modules/user/pages/orders";
import Whishlist from "./modules/user/pages/whishlist";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext";


import { ToastContainer } from "react-toastify";
import Profile from "./modules/user/pages/profile";
import Search from "./modules/user/pages/search";
import Checkout from "./modules/user/pages/checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./modules/user/pages/notfound";
import OurStory from "./modules/user/pages/ourStory";
import AdminProducts from "./modules/admin/admin-products";
import AdminUsers from "./modules/admin/admin-user";
import UserDetails from "./modules/admin/user-details";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./modules/admin/dashboard";
import AdminLayout from "./modules/admin/adminLayout";
import PublicRoute from "./components/PublicRoute";
import UserOverview from "./modules/admin/userOverview";
import { SearchProvider } from "./context/searchContext";
import ProductDetail from "./modules/user/pages/ProductDetail";

function AppWithProviders() {
  return (
    <>
      <ToastContainer autoClose={2000} theme="dark" hideProgressBar />

      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
                    <SearchProvider>

            {/* to prevent admin access the gust pages */}
          <Routes>
            <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} /> 

            <Route path="/search" element={<Search />} />
                <Route path="/ourstory" element={<OurStory />} />

            </Route>

<Route element={<ProtectedRoute />}>
    <Route path="/carts" element={<Carts />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/whishlist" element={<Whishlist />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/checkout" element={<Checkout />} />
</Route>


 <Route path="/admin" element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="overview" element={<UserOverview />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="users/:id" element={<UserDetails />} />
  </Route>
</Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
                  </SearchProvider>

          </OrderProvider> 
        </WishlistProvider>
      </CartProvider>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppWithProviders />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

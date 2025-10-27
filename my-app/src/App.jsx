// import "./App.css";
// import Login from "./auth/login";
// import Register from "./auth/register";

// import Home from "./modules/user/pages/home";
// import Carts from "./modules/user/pages/carts";
// import Products from "./modules/user/pages/products";
// import Orders from "./modules/user/pages/orders";
// import Whishlist from "./modules/user/pages/whishlist";

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { CartProvider } from "./context/CartContext";
// import { AuthProvider } from "./context/AuthContext";
// import { WishlistProvider } from "./context/WishlistContext";
// import { OrderProvider } from "./context/OrderContext";

// import { ToastContainer } from "react-toastify";
// import Profile from "./modules/user/pages/profile";
// import Search from "./modules/user/pages/search";
// import Checkout from "./modules/user/pages/checkout";
// import ProtectedRoute from "./components/ProtectedRoute";
// import NotFound from "./modules/user/pages/notfound";
// import OurStory from "./modules/user/pages/ourStory";
// import AdminProducts from "./modules/admin/admin-products";
// import AdminUsers from "./modules/admin/admin-user";
// import UserDetails from "./modules/admin/user-details";
// import AdminRoute from "./components/AdminRoute";
// import AdminDashboard from "./modules/admin/dashboard";
// import AdminLayout from "./modules/admin/adminLayout";
// import PublicRoute from "./components/PublicRoute";
// import UserOverview from "./modules/admin/userOverview";
// import { SearchProvider } from "./context/SearchContext";
// import ProductDetail from "./modules/user/pages/ProductDetail";

// function AppWithProviders() {
//   return (
//     <>
//       <ToastContainer autoClose={2000} theme="dark" hideProgressBar />

//       <CartProvider>
//         <WishlistProvider>
//           <OrderProvider>
//             <SearchProvider>
//               {/* to prevent admin access the gust pages */}
//               <Routes>
//                 <Route element={<PublicRoute />}>
//                   <Route path="/login" element={<Login />} />
//                   <Route path="/register" element={<Register />} />
//                   <Route path="/" element={<Home />} />
                  
//                   <Route path="/products" element={<Products />} />
//                   <Route path="/products/:id" element={<ProductDetail />} />

//                   <Route path="/search" element={<Search />} />
//                   <Route path="/ourstory" element={<OurStory />} />
//                 </Route>

//                 <Route element={<ProtectedRoute />}>
//                   <Route path="/carts" element={<Carts />} />
//                   <Route path="/orders" element={<Orders />} />
//                   <Route path="/whishlist" element={<Whishlist />} />
//                   <Route path="/profile" element={<Profile />} />
//                   <Route path="/checkout" element={<Checkout />} />
//                 </Route>

//                 <Route path="/admin" element={<AdminRoute />}>
//                   <Route element={<AdminLayout />}>
//                     <Route index element={<AdminDashboard />} />
//                     <Route path="overview" element={<UserOverview />} />
//                     <Route path="products" element={<AdminProducts />} />
//                     <Route path="users" element={<AdminUsers />} />
//                     <Route path="users/:id" element={<UserDetails />} />
//                   </Route>
//                 </Route>

//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </SearchProvider>
//           </OrderProvider>
//         </WishlistProvider>
//       </CartProvider>
//     </>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppWithProviders />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;



import React, { Suspense, lazy } from "react";
import "./App.css";

// --- LAZY-LOADED PAGES ---
// Auth
const Login = lazy(() => import("./auth/login"));
const Register = lazy(() => import("./auth/register"));

// User Pages
import Home from "./modules/user/pages/home";
const Carts = lazy(() => import("./modules/user/pages/carts"));
const Products = lazy(() => import("./modules/user/pages/products"));
const Orders = lazy(() => import("./modules/user/pages/orders"));
const Whishlist = lazy(() => import("./modules/user/pages/whishlist"));
const Profile = lazy(() => import("./modules/user/pages/profile"));
const Search = lazy(() => import("./modules/user/pages/search"));
const Checkout = lazy(() => import("./modules/user/pages/checkout"));
const NotFound = lazy(() => import("./modules/user/pages/notfound"));
const OurStory = lazy(() => import("./modules/user/pages/ourStory"));
const ProductDetail = lazy(() => import("./modules/user/pages/ProductDetail"));

// Admin Pages
const AdminProducts = lazy(() => import("./modules/admin/admin-products"));
const AdminUsers = lazy(() => import("./modules/admin/admin-user"));
const UserDetails = lazy(() => import("./modules/admin/user-details"));
const AdminDashboard = lazy(() => import("./modules/admin/dashboard"));
const UserOverview = lazy(() => import("./modules/admin/userOverview"));

// --- CORE IMPORTS ---
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext";
import { SearchProvider } from "./context/SearchContext";

import { ToastContainer } from "react-toastify";

// Route Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./modules/admin/adminLayout";
import PublicRoute from "./components/PublicRoute";
import ShimmerLoader from "./components/ShimmerLoader";

/**
 * A simple full-page loading fallback component.
 */
function LoadingFallback() {
  return <ShimmerLoader/>
}

function AppWithProviders() {
  return (
    <>
      <ToastContainer autoClose={2000} theme="dark" hideProgressBar />

      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <SearchProvider>
              {/* Wrap all Routes in a single Suspense component.
                This will catch any lazy-loaded component that is trying to render.
              */}
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/ourstory" element={<OurStory />} />
                  </Route>

                  {/* Protected user routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/carts" element={<Carts />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/whishlist" element={<Whishlist />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/checkout" element={<Checkout />} />
                  </Route>

                  {/* Protected admin routes */}
                  <Route path="/admin" element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="overview" element={<UserOverview />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="users/:id" element={<UserDetails />} />
                    </Route>
                  </Route>

                  {/* Catch-all Not Found route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
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


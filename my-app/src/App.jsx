// import "./App.css";
// import Login from "./auth/login";
// import Register from "./auth/register";

// import Home from "./modules/user/pages/home";

// import Carts from "./modules/user/pages/carts";
// import Products from "./modules/user/pages/products";
// import Orders from "./modules/user/pages/orders";
// import Whishlist from "./modules/user/pages/whishlist";

// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import { AuthProvider } from "./context/AuthContext";



// function App() {
//   return (
//     <>
//      <AuthProvider> <CartProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           <Route path="/" element={<Home />} />
//           <Route path="/products" element={<Products />} />

//           <Route path="/carts" element={<Carts />} />



//           <Route path="/orders" element={<Orders />} />
//           <Route path="/whishlist" element={<Whishlist />} />
//         </Routes>
//       </BrowserRouter></CartProvider>
//            </AuthProvider>

//     </>
//   );
// }

// export default App;






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

import { ToastContainer } from "react-toastify";
import Profile from "./modules/user/pages/profile";
import Search from "./modules/user/pages/search";
import Checkout from "./modules/user/pages/checkout";
// Custom wrapper so CartProvider knows the logged-in user
function AppWithProviders() {


  return (
 <>
      <ToastContainer/>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/carts" element={<Carts />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/whishlist" element={<Whishlist />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/search" element={<Search />} />
                         <Route path="/checkout" element={<Checkout />} />
                        
                        
          </Routes>
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

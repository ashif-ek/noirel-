
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 px-6 py-4 text-white sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <Link 
//           to="/" 
//           className="text-2xl font-serif tracking-[0.3em] font-light transition-all hover:tracking-[0.4em]"
//         >
//           NOIRÉL
//         </Link>
        
//         <div className="hidden md:flex space-x-8">
//           <Link 
//             to="/collections" 
//             className="text-sm uppercase tracking-widest font-light hover:text-gray-300 transition-all duration-300"
//           >
//             Collections
//           </Link>
//           <Link 
//             to="/shop" 
//             className="text-sm uppercase tracking-widest font-light hover:text-gray-300 transition-all duration-300"
//           >
//             Shop
//           </Link>
//           <Link 
//             to="/about" 
//             className="text-sm uppercase tracking-widest font-light hover:text-gray-300 transition-all duration-300"
//           >
//             Our Story
//           </Link>
//         </div>
        
//         <div className="flex items-center space-x-6">
//           <Link 
//             to="/search" 
//             className="hover:text-gray-300 transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </Link>
//           <Link 
//             to="/account" 
//             className="hover:text-gray-300 transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//           </Link>
//           <Link 
//             to="/cart" 
//             className="hover:text-gray-300 transition-colors relative"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//             </svg>
//             <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }



import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; 

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart(); 


  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 px-6 py-4 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand */}
        <Link 
          to="/" 
          className="text-2xl font-serif tracking-[0.3em] font-light transition-all hover:tracking-[0.4em]"
        >
          NOIRÉL
        </Link>

        {/* Middle menu */}
        <div className="hidden md:flex space-x-8">
          <Link to="/products" className="text-sm uppercase tracking-widest font-light hover:text-gray-300 transition-all duration-300">Collections</Link>
          <Link to="/carts" className="text-sm uppercase tracking-widest font-light hover:text-gray-300 transition-all duration-300">Shop</Link>
          <Link to="/whishlist" className="text-sm uppercase tracking-widest font-light hover:text-gray-300 transition-all duration-300">favorite</Link>
        </div>

        {/* Right menu */}
        <div className="flex items-center space-x-6">

          {/* Search */}
          <Link to="/search" className="hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* Profile/Login */}
          <Link 
            to={user ? "/profile" : "/login"} 
            className="hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

{/* login grreteing, and logout */}

          {user && (
            <>
              <span className="text-sm">Hi, {user.username}</span>
              <button 
                onClick={logout} 
                className="hover:text-red-400 transition-colors text-sm"
              >
                Logout
              </button>
            </>
          )}

{/* Cart */}
          <Link to="/carts" className="hover:text-gray-300 transition-colors relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
{/* Show count */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

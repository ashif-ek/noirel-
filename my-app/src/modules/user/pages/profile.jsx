import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import Api from "../../../auth/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.id) {
      Api.get(`/orders?userId=${user.id}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error fetching orders", err));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <h1 className="text-xl font-semibold">Please login to view profile</h1>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button
          onClick={logout}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Logout
        </button>
      </div>

      {/* User info */}
      <div className="bg-white rounded-lg shadow p-4 space-y-2">
        <p><span className="font-medium">ID:</span> {user.id}</p>
        <p><span className="font-medium">Name:</span> {user.username}</p>
        <p><span className="font-medium">Email:</span> {user.useremail}</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/carts" className="bg-gray-800 text-white rounded-lg p-4 text-center">
          Cart ({cart.length})
        </Link>
        <Link to="/wishlist" className="bg-gray-800 text-white rounded-lg p-4 text-center">
          Wishlist ({wishlist.length})
        </Link>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders yet</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((o) => (
              <li key={o.id} className="border-b pb-1 text-sm">
                Order #{o.id} • {o.items?.length || 0} items • ${o.total}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}

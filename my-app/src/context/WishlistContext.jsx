// src/context/WishlistContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import Api from "../auth/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth(); // Get user from AuthContext

  // Fetch wishlist when user changes (login, logout, refresh)
  useEffect(() => {
    if (user?.id) {
      Api.get(`/users/${user.id}`)
        .then((res) => setWishlist(res.data.wishlist || []))
        .catch((err) => console.error("Error fetching wishlist", err));
    } else {
      setWishlist([]); // clear wishlist on logout
    }
  }, [user]);

  // Sync wishlist with backend
  const syncWishlist = async (updatedWishlist) => {
    if (!user?.id) return;
    try {
      setWishlist(updatedWishlist);
      await Api.patch(`/users/${user.id}`, { wishlist: updatedWishlist });
    } catch (err) {
      console.error("Error syncing wishlist", err);
    }
  };

  const addToWishlist = (product) => {
    if (!user) {
      alert("Please login to add to your wishlist.");
      return;
    }
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) return; // Don't add if it's already there
    syncWishlist([...wishlist, product]);
  };

  const removeFromWishlist = (productId) => {
    syncWishlist(wishlist.filter((item) => item.id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);
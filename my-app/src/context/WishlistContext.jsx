import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import Api from "../auth/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

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
  const syncWishlist = useCallback(async (updatedWishlist) => {
    if (!user?.id) return;
    try {
      setWishlist(updatedWishlist);
      await Api.patch(`/users/${user.id}`, { wishlist: updatedWishlist });
    } catch (err) {
      console.error("Error syncing wishlist", err);
    }
  }, [user]);

  const addToWishlist = useCallback((product) => {
    if (!user) {
      toast.warn("Please login to add to your wishlist.");
      return;
    }
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) return; // Don't add if it's already there
    syncWishlist([...wishlist, product]);
  }, [user, wishlist, syncWishlist]);

  const removeFromWishlist = useCallback((productId) => {
    syncWishlist(wishlist.filter((item) => item.id !== productId));
  }, [wishlist, syncWishlist]);

  const value = useMemo(() => ({
    wishlist, addToWishlist, removeFromWishlist
  }), [wishlist, addToWishlist, removeFromWishlist]);

  return (
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);
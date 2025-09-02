// src/context/WishlistContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import Api from "../auth/api";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  // Watch for login/logout changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch wishlist when userId changes
  useEffect(() => {
    if (userId) {
      Api.get(`/users/${userId}`)
        .then((res) => setWishlist(res.data.wishlist || []))
        .catch((err) => console.error("Error fetching wishlist", err));
    } else {
      setWishlist([]); // clear wishlist on logout
    }
  }, [userId]);

  // Sync wishlist with backend
  const syncWishlist = async (updatedWishlist) => {
    if (!userId) return;
    try {
      setWishlist(updatedWishlist);
      await Api.patch(`/users/${userId}`, { wishlist: updatedWishlist });
    } catch (err) {
      console.error("Error syncing wishlist", err);
    }
  };

  const addToWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) return;
    syncWishlist([...wishlist, product]);
  };

  const removeFromWishlist = (productId) => {
    syncWishlist(wishlist.filter((item) => item.id !== productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);

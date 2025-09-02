import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // get logged-in user
import Api from "../auth/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth(); // userId from AuthContext
  const [cart, setCart] = useState([]);

  // 🔹 Fetch cart whenever user logs in or refreshes
  useEffect(() => {
    if (user) {
      Api.get(`/users/${user}`)
        .then((res) => setCart(res.data.cart || []))
        .catch((err) => console.error("Error fetching cart:", err));
    } else {
      setCart([]); // reset when no user
    }
  }, [user]);

  // 🔹 Sync cart to DB
  const syncCart = async (updatedCart) => {
    try {
      setCart(updatedCart); // Optimistic UI
      if (user) {
        await Api.patch(`/users/${user}`, { cart: updatedCart });
      }
    } catch (err) {
      console.error("Error syncing cart:", err);
    }
  };

  // Add product
  const addToCart = (product) => {
    if (!user) {
      alert("Please login first!");
      return;
    }

    let updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((item) => item.id === product.id);

    if (itemIndex >= 0) {
      // already in cart → increase qty
      updatedCart[itemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    syncCart(updatedCart);
  };

  // Update quantity (+/-)
  const updateQuantity = (productId, diff) => {
    let updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + diff) }
        : item
    );
    syncCart(updatedCart);
  };

  //  Remove single item
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    syncCart(updatedCart);
  };

  //  Clear all items
  const clearCart = () => {
    syncCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

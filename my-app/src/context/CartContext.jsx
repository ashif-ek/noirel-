import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext"; 
import Api from "../auth/api";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth(); 
  const [cart, setCart] = useState([]);

  // Fetch cart whenever user logs in or refreshes
  useEffect(() => {
    if (user?.id) {
      Api.get(`/users/${user.id}`)
        .then((res) => setCart(res.data.cart || []))
        .catch((err) => console.error("Error fetching cart:", err));
    } else {
      setCart([]); // reset when no user
    }
  }, [user]);

  const syncCart = useCallback(async (updatedCart) => {
    try {
      setCart(updatedCart);
      if (user?.id) {
        await Api.patch(`/users/${user.id}`, { cart: updatedCart });
      }
    } catch (err) {
      console.error("Error syncing cart:", err);
    }
  }, [user]);

  const addToCart = useCallback((product) => {
    if (!user) {
      toast("Please login first!");
      return;
    }

    let updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((item) => item.id === product.id);

    if (itemIndex >= 0) {
      // if cart have then ncreese
      updatedCart[itemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    syncCart(updatedCart);
  }, [cart, user, syncCart]);

  // Update quantity (+/-)
  const updateQuantity = useCallback((productId, diff) => {
    let updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + diff) }
        : item
    );
    syncCart(updatedCart);
  }, [cart, syncCart]);


  const removeFromCart = useCallback((productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    syncCart(updatedCart);
  }, [cart, syncCart]);


  const clearCart = useCallback(() => {
    syncCart([]);
  }, [syncCart]);

  const value = useMemo(() => ({
    cart, addToCart, updateQuantity, removeFromCart, clearCart
  }), [cart, addToCart, updateQuantity, removeFromCart, clearCart]);

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);



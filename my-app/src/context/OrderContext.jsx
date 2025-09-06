import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import Api from "../auth/api"; // Your API helper
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  /**
   * Places an order by fetching the current user's data,
   * adding the new order, clearing the cart, and updating the server.
   */
  const placeOrder = async (shippingDetails, total) => {
    if (!user || cart.length === 0) {
      toast.error("You must be logged in or have items in your cart to place an order.");
      return;
    }

    // 1. Construct the new order object
    const newOrder = {
      items: [...cart],
      total: parseFloat(total.toFixed(2)),
      shipping: shippingDetails,
      paymentMethod: shippingDetails.paymentMethod,
      date: new Date().toISOString(), // Adds a timestamp for the order
    };

    try {
      // 2. Get the most recent user data to avoid overwriting anything
      const response = await Api.get(`/users/${user.id}`);
      const currentUserData = response.data;

      // 3. Prepare the updated user object
      const updatedUserData = {
        ...currentUserData,
        orders: [...currentUserData.orders, newOrder], // Add the new order
        cart: [], // Empty the cart
      };

      // 4. Update the user data on the server using PUT to replace the object
      await Api.put(`/users/${user.id}`, updatedUserData);

      // 5. Clear the cart in the local state (from CartContext)
      clearCart();

      // 6. Notify the user and redirect to a success page
      toast.success("Order placed successfully! 🎉");
      navigate("/order-success"); // We'll create this page next

    } catch (err) {
      console.error("Failed to place order:", err);
      toast.error("There was an issue placing your order. Please try again.");
    }
  };

  return (
    <OrderContext.Provider value={{ placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

// Custom hook to use the OrderContext
// eslint-disable-next-line react-refresh/only-export-components
export const useOrders = () => useContext(OrderContext);

import { createContext, useContext } from "react";
// Assuming context files are co-located
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
// Correcting the path to the API helper, assuming a more standard project structure.
import Api from "../auth/api"; // Your API helper
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const placeOrder = async (shippingDetails, total) => {
    if (!user || cart.length === 0) {
      toast.error(
        "You must be logged in or have items in your cart to place an order."
      );
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Could not load payment gateway. Please try again later.");
      return;
    }

    const options = {
      key: "rzp_test_edrzdb8Gbx5U5M", // Your Razorpay Key ID
      amount: total * 100, // Amount in the smallest currency unit (paise)
      currency: "INR",
      name: "NOIRÉL",
      description: "Order Payment",
      image: "perfume1.png",
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id;
        // Payment successful, now place the order
        await createOrder(shippingDetails, total, paymentId);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: "9999999999", // You can get this from user profile if available
      },
      notes: {
        address: `${shippingDetails.address}, ${shippingDetails.city}`,
      },
      theme: {
        color: "black-100",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
        toast.error("Payment failed. Please try again.");
        console.error("Payment Failed:", response.error);
    });
    paymentObject.open();
  };

  const createOrder = async (shippingDetails, total, paymentId) => {
     const newOrder = {
       items: [...cart],
       total: parseFloat(total.toFixed(2)),
       shipping: shippingDetails,
       paymentMethod: shippingDetails.paymentMethod,
       paymentId: paymentId,
       date: new Date().toISOString(),
     };

     try {
       const response = await Api.get(`/users/${user.id}`);
       const currentUserData = response.data;

       const updatedUserData = {
         ...currentUserData,
         orders: [...currentUserData.orders, newOrder],
         cart: [],
       };

       await Api.put(`/users/${user.id}`, updatedUserData);

       clearCart();

       toast.success("Order placed successfully! ");
       navigate("/order-success");
     } catch (err) {
       console.error("Failed to place order:", err);
       toast.error(
         "There was an issue placing your order. Please try again."
       );
     }
  }


  return (
    <OrderContext.Provider value={{ placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOrders = () => useContext(OrderContext);


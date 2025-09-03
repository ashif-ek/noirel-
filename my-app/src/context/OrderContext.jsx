
// import { createContext, useContext } from "react";
// // Assuming context files are co-located
// import { useAuth } from "./AuthContext";
// import { useCart } from "./CartContext";
// // Correcting the path to the API helper, assuming a more standard project structure.
// import Api from "../auth/api"; // Your API helper
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const OrderContext = createContext();

// export function OrderProvider({ children }) {
//   const { user } = useAuth();
//   const { cart, clearCart } = useCart();
//   const navigate = useNavigate();

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => {
//         resolve(true);
//       };
//       script.onerror = () => {
//         resolve(false);
//       };
//       document.body.appendChild(script);
//     });
//   };

//   const placeOrder = async (shippingDetails, total) => {
//     if (!user || cart.length === 0) {
//       toast.error(
//         "You must be logged in or have items in your cart to place an order."
//       );
//       return;
//     }

//     const scriptLoaded = await loadRazorpayScript();
//     if (!scriptLoaded) {
//       toast.error("Could not load payment gateway. Please try again later.");
//       return;
//     }

//     const options = {
//       key: "rzp_test_edrzdb8Gbx5U5M", // Your Razorpay Key ID
//       amount: total * 100, // Amount in the smallest currency unit (paise)
//       currency: "INR",
//       name: "NOIRÉL",
//       description: "Order Payment",
//       image: "perfume1.png",
//       handler: async function (response) {
//         const paymentId = response.razorpay_payment_id;
//         // Payment successful, now place the order
//         await createOrder(shippingDetails, total, paymentId);
//       },
//       prefill: {
//         name: user.name,
//         email: user.email,
//         contact: "9999999999", // You can get this from user profile if available
//       },
//       notes: {
//         address: `${shippingDetails.address}, ${shippingDetails.city}`,
//       },
//       theme: {
//         color: "black-100",
//       },
//     };

//     const paymentObject = new window.Razorpay(options);
//     paymentObject.on("payment.failed", function (response) {
//         toast.error("Payment failed. Please try again.");
//         console.error("Payment Failed:", response.error);
//     });
//     paymentObject.open();
//   };

//   const createOrder = async (shippingDetails, total, paymentId) => {
//      const newOrder = {
//        items: [...cart],
//        total: parseFloat(total.toFixed(2)),
//        shipping: shippingDetails,
//        paymentMethod: shippingDetails.paymentMethod,
//        paymentId: paymentId,
//        date: new Date().toISOString(),
//      };

//      try {
//        const response = await Api.get(`/users/${user.id}`);
//        const currentUserData = response.data;

//        const updatedUserData = {
//          ...currentUserData,
//          orders: [...currentUserData.orders, newOrder],
//          cart: [],
//        };

//        await Api.put(`/users/${user.id}`, updatedUserData);

//        clearCart();

//        toast.success("Order placed successfully! ");
//        navigate("/order-success");
//      } catch (err) {
//        console.error("Failed to place order:", err);
//        toast.error(
//          "There was an issue placing your order. Please try again."
//        );
//      }
//   }


//   return (
//     <OrderContext.Provider value={{ placeOrder }}>
//       {children}
//     </OrderContext.Provider>
//   );
// }

// // eslint-disable-next-line react-refresh/only-export-components
// export const useOrders = () => useContext(OrderContext);

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios"; // Import axios for API calls
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import Api from "../auth/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// A reliable fallback rate in case the API fails
const STATIC_FALLBACK_RATE = 83.5;
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // State to hold the current USD to INR exchange rate
  const [exchangeRate, setExchangeRate] = useState(null);

  // --- NEW: Fetch and cache the exchange rate on component mount ---
  useEffect(() => {
    const fetchAndSetRate = async () => {
      try {
        // 1. Check for a fresh cached rate first
        const cachedRateData = JSON.parse(localStorage.getItem("usdToInrRate"));
        const now = new Date().getTime();

        if (cachedRateData && now - cachedRateData.timestamp < CACHE_DURATION) {
          console.log("Using cached exchange rate:", cachedRateData.rate);
          setExchangeRate(cachedRateData.rate);
          return; // Use cached rate and skip API call
        }

        // 2. If no fresh cache, fetch from API
        console.log("Fetching live exchange rate...");
        const response = await axios.get(
          "https://api.frankfurter.app/latest?from=USD&to=INR"
        );
        const liveRate = response.data.rates.INR;

        // 3. Update state and cache with the new rate and timestamp
        setExchangeRate(liveRate);
        localStorage.setItem(
          "usdToInrRate",
          JSON.stringify({ rate: liveRate, timestamp: now })
        );
      } catch (error) {
        // 4. On API failure, use the static fallback rate
        console.error("Failed to fetch live exchange rate. Using fallback.", error);
        toast.warn("Could not fetch live exchange rate. Using a fallback rate.");
        setExchangeRate(STATIC_FALLBACK_RATE);
      }
    };

    fetchAndSetRate();
  }, []); // Empty dependency array ensures this runs only once on mount

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /**
   * Creates the final order object and saves it.
   * @param {object} shippingDetails - The shipping details.
   * @param {object} orderTotals - An object containing both USD and INR totals.
   * @param {string} paymentId - The Razorpay payment ID.
   */
  const createOrder = useCallback(async (shippingDetails, orderTotals, paymentId) => {
    // --- NEW: Dual-currency order object for accurate records ---
    const newOrder = {
      items: [...cart],
      // Record both totals and the rate used
      totalUsd: parseFloat(orderTotals.totalUsd.toFixed(2)),
      totalInr: parseFloat(orderTotals.totalInr.toFixed(2)),
      exchangeRateUsed: exchangeRate,
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
      toast.success("Order placed successfully!");
      navigate("/order-success");
    } catch (err) {
      console.error("Failed to place order:", err);
      toast.error(
        "There was an issue placing your order. Please try again."
      );
    }
  }, [cart, user, exchangeRate, clearCart, navigate]);

  /**
   * Place an order.
   * @param {object} shippingDetails - The shipping details.
   * @param {number} totalUsd - The total order amount in USD.
   */
  const placeOrder = useCallback(async (shippingDetails, totalUsd) => {
    if (!user || cart.length === 0) {
      toast.error(
        "You must be logged in or have items in your cart to place an order."
      );
      return;
    }

    // --- NEW: Check if exchange rate is loaded ---
    if (!exchangeRate) {
      toast.error(
        "Exchange rate is not available yet. Please wait a moment and try again."
      );
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Could not load payment gateway. Please try again later.");
      return;
    }

    // --- NEW: Convert USD to INR for payment ---
    const totalInr = totalUsd * exchangeRate;

    const options = {
      key: "rzp_test_edrzdb8Gbx5U5M",
      // Amount must be in the smallest currency unit (paise)
      amount: Math.round(totalInr * 100),
      currency: "INR",
      name: "NOIRÉL",
      description: "Order Payment",
      image: "perfume1.png",
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id;
        // --- MODIFIED: Pass both USD and INR totals to createOrder ---
        await createOrder(shippingDetails, { totalUsd, totalInr }, paymentId);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: "9999999999",
      },
      notes: {
        address: `${shippingDetails.address}, ${shippingDetails.city}`,
      },
      theme: {
        // --- MODIFIED: Solid black theme ---
        color: "#000000",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment Failed:", response.error);
    });
    paymentObject.open();
  }, [user, cart, exchangeRate, createOrder]);

  const value = useMemo(() => ({
    placeOrder
  }), [placeOrder]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}


// eslint-disable-next-line react-refresh/only-export-components
export const useOrders = () => useContext(OrderContext);
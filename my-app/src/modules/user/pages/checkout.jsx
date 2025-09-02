// CheckoutPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  const [address, setAddress] = useState("");
  const [orders, setOrders] = useState([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePlaceOrder = () => {
    if (!user) {
      alert("Please login first!");
      return;
    }
    if (!address) {
      alert("Enter shipping address!");
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: cart,
      total,
      address,
      status: "Pending",
    };

    // Save to localStorage (for demo)
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    storedOrders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(storedOrders));

    setOrders(storedOrders);
    clearCart();
    alert("Order placed successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      <h3>Cart Items</h3>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} x {item.qty} = ${item.price * item.qty}
            </li>
          ))}
        </ul>
      )}

      <h3>Total: ${total}</h3>

      <div>
        <label>Shipping Address:</label>
        <br />
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <button onClick={handlePlaceOrder} disabled={!cart.length}>
        Place Order
      </button>

      <hr />
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              Order #{order.id} - ${order.total} - {order.status}
              <br />
              Ship to: {order.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

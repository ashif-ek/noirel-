import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext"; 
import Api from "../../../auth/api"; // axios instance

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user, setUser } = useAuth(); // ✅ get logged-in user from context

const handlePlaceOrder = async () => {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  try {
    // Build new orders array
    const newOrders = [...(user.orders || []), ...cart];

    // Send only what changed (cart + orders)
    const res = await Api.patch(`/users/${user.id}`, {
      orders: newOrders,
      cart: [],
    });

    // ✅ use backend response to update AuthContext
    setUser(res.data);

    // ✅ clear frontend cart
    clearCart();

    alert("Order placed successfully!");
  } catch (err) {
    console.error("Error placing order:", err);
    alert("Something went wrong.");
  }
};


  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <div className="mb-6 border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
        >
          Place Order
        </button>
      </div>
      <Footer />
    </>
  );
}

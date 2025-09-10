// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Api from "../../auth/api";

// export default function UserDetails() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       try {
//         const res = await Api.get(`/users/${id}`);
//         setUser(res.data);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//       setLoading(false);
//     };

//     fetchUser();
//   }, [id]);

//   if (loading) return <p className="p-4">Loading user details...</p>;
//   if (!user) return <p className="p-4">User not found.</p>;

//   return (
//     <div className="p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-bold mb-4">{user.name}'s Details</h2>

//       <div className="space-y-2 mb-6">
//         <p>
//           <span className="font-semibold">Email:</span> {user.email}
//         </p>
//         <p>
//           <span className="font-semibold">Role:</span>{" "}
//           {user.role || "customer"}
//         </p>
//       </div>

//       <h3 className="text-xl font-semibold mb-2">Order Details (Sample)</h3>
//       <ul className="list-disc pl-6 space-y-1 text-gray-700">
//         <li>Order #101 – Perfume A – $120 – Status: Delivered</li>
//         <li>Order #102 – Perfume B – $90 – Status: Shipped</li>
//       </ul>
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Api from "../../auth/api";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await Api.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  // 🔹 Block / Unblock handler
  const toggleBlock = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const updated = await Api.patch(`/users/${id}`, {
        isBlocked: !user.isBlocked,
      });
      setUser(updated.data); // refresh local state
    } catch (err) {
      console.error("Error updating block status:", err);
    }
    setUpdating(false);
  };

  if (loading) return <p className="p-4">Loading user details...</p>;
  if (!user) return <p className="p-4">User not found.</p>;

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{user.name}'s Details</h2>

      <div className="space-y-2 mb-6">
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span>{" "}
          {user.role || "customer"}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          {user.isBlocked ? (
            <span className="text-red-600 font-medium">Blocked</span>
          ) : (
            <span className="text-green-600 font-medium">Active</span>
          )}
        </p>
      </div>

      {/* 🔹 Block/Unblock button */}
      <button
        onClick={toggleBlock}
        disabled={updating}
        className={`px-4 py-2 rounded text-white ${
          user.isBlocked ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {updating
          ? "Updating..."
          : user.isBlocked
          ? "Unblock User"
          : "Block User"}
      </button>

      {/* 🔹 Order History */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Order History</h3>
      {user.orders && user.orders.length > 0 ? (
        <div className="space-y-6">
          {[...user.orders].reverse().map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center bg-gray-100 px-4 py-2">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-semibold">₹{order.total}</p>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping & Payment */}
              <div className="p-4 border-t text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold">Ship to:</span>{" "}
                  {order.shipping.fullName}
                </p>
                <p>
                  {order.shipping.address}, {order.shipping.city},{" "}
                  {order.shipping.postalCode}
                </p>
                <p>{order.shipping.country}</p>
                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {order.paymentMethod} ({order.paymentId})
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No orders found for this user.</p>
      )}
    </div>
  );
}

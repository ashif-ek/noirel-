import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://your-api.com/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
      setLoading(false);
    };

    fetchUser();
  }, [id]);

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
      </div>

      <h3 className="text-xl font-semibold mb-2">Order Details (Sample)</h3>
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>Order #101 – Perfume A – $120 – Status: Delivered</li>
        <li>Order #102 – Perfume B – $90 – Status: Shipped</li>
      </ul>
    </div>
  );
}

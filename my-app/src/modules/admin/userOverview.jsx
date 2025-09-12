
import { useEffect, useState } from "react";
import Api from "../../auth/api";
import { FiUser, FiMail, FiShoppingCart, FiHeart, FiPackage, FiMapPin, FiTrendingUp, FiCalendar, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

export default function UserOverview() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
try {
  const res = await Api.get("/users");

  // to remove admin
  const normalUsers = res.data.filter(u => u.role !== "admin");

  setUsers(normalUsers);
  setFilteredUsers(normalUsers);
} catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users");
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Filter users
  useEffect(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      const statusBool = statusFilter === "active";
      result = result.filter(user => user.isBlocked !== statusBool);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, statusFilter, users]);

  // Summary stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => !user.isBlocked).length;
  const totalOrders = users.reduce((sum, user) => sum + (user.orders?.length || 0), 0);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">User Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Comprehensive view of all registered users and their activities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <FiUser className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-800">{totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <FiTrendingUp className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-gray-800">{activeUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <FiPackage className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-800">{totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <FiUser className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No users found</h3>
          <p className="text-gray-500">
            {users.length === 0 
              ? "No users have registered yet." 
              : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
              {/* User Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium flex-shrink-0 mr-3">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.name || "No name"}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <FiMail className="mr-1 text-xs" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isBlocked 
                      ? "bg-red-100 text-red-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">ID:</span> {user.id}
                </div>
                {user.role && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {user.role}
                    </span>
                  </div>
                )}
              </div>

              {/* Activity Metrics */}
              <div className="p-4 grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <FiPackage className="mx-auto text-blue-600 mb-1" />
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-xl font-semibold text-blue-700">{user.orders?.length || 0}</p>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <FiHeart className="mx-auto text-pink-600 mb-1" />
                  <p className="text-sm text-gray-600">Wishlist</p>
                  <p className="text-xl font-semibold text-pink-700">{user.wishlist?.length || 0}</p>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <FiShoppingCart className="mx-auto text-indigo-600 mb-1" />
                  <p className="text-sm text-gray-600">Cart</p>
                  <p className="text-xl font-semibold text-indigo-700">{user.cart?.length || 0}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="p-4 border-t border-gray-100">
                {user.address && (
                  <div className="flex items-start text-sm text-gray-600 mb-2">
                    <FiMapPin className="mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{user.address}</span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex items-center text-xs text-gray-500">
                    <FiCalendar className="mr-1 text-gray-400" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




























// import { useEffect, useState } from "react";
// import Api from "../../auth/api";

// export default function UserOverview() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     // Fetches all users with their detailed information
//     Api.get("/users").then((res) => setUsers(res.data));
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">User Overview</h2>
//       <div className="space-y-6">
//         {users.map((user) => (
//           <div key={user.id} className="border rounded-lg bg-white shadow p-4 transition-shadow hover:shadow-md">
//             {/* User Basic Info */}
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <p className="font-bold text-lg text-gray-800">
//                   {user.name} <span className="text-sm text-gray-400 font-normal">({user.id})</span>
//                 </p>
//                 <p className="text-gray-600">{user.email}</p>
//                 <p className="text-sm">Role: <span className="font-semibold">{user.role}</span></p>
//               </div>
//               <div>
//                  <p className="text-sm text-right">
//                     Status:{" "}
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
//                       {user.isBlocked ? "Blocked" : "Active"}
//                     </span>
//                   </p>
//               </div>
//             </div>

//             {/* --- NEW: User Activity Counts --- */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
//                {/* Orders Count */}
//               <div className="bg-gray-50 p-3 rounded-lg text-center">
//                   <p className="text-sm text-gray-500">Total Orders</p>
//                   <p className="text-2xl font-bold text-blue-600">{user.orders?.length || 0}</p>
//               </div>
//               {/* Wishlist Count */}
//               <div className="bg-gray-50 p-3 rounded-lg text-center">
//                   <p className="text-sm text-gray-500">Wishlist Items</p>
//                   <p className="text-2xl font-bold text-pink-600">{user.wishlist?.length || 0}</p>
//               </div>
//                {/* Cart Count */}
//               <div className="bg-gray-50 p-3 rounded-lg text-center">
//                   <p className="text-sm text-gray-500">Cart Items</p>
//                   <p className="text-2xl font-bold text-indigo-600">{user.cart?.length || 0}</p>
//               </div>
//             </div>

//             {/* Shipping Address (Optional Display) */}
//             {user.address && (
//               <div className="mt-4 border-t border-gray-100 pt-3">
//                 <h4 className="font-semibold text-sm">Shipping Address:</h4>
//                 <p className="text-sm text-gray-700">{user.address}</p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






// import { Link, Outlet } from "react-router-dom";

// export default function AdminLayout() {
//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside className="w-56 bg-gray-800 text-white p-4">
//         <h2 className="text-xl font-bold mb-6">Admin</h2>
//         <nav className="space-y-2">
//           <Link to="/admin" className="block p-2 rounded hover:bg-gray-700">
//             Home
//           </Link>
//           <Link to="/admin/products" className="block p-2 rounded hover:bg-gray-700">
//             Products
//           </Link>
//           <Link to="/admin/users" className="block p-2 rounded hover:bg-gray-700">
//             Users
//           </Link>
//         </nav>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-6 bg-gray-100">
//         <Outlet />
//       </main>
//     </div>
//   );
// }











import { Link, Outlet, useLocation } from "react-router-dom";
import { FiHome, FiBox, FiUsers, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";


export default function AdminLayout() {
  const location = useLocation();
    const { logout } = useAuth();
  

  const navItems = [
    { name: "Home", path: "/admin", icon: <FiHome /> },
    { name: "Products", path: "/admin/products", icon: <FiBox /> },
    { name: "Users", path: "/admin/users", icon: <FiUsers /> },
  ];



  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col justify-between">
        <div>
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Admin</h2>
          </div>

          <nav className="mt-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg mb-4 ml-4 hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

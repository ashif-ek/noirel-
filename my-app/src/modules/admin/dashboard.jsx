import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import Api from "../../auth/api";
import { FiHome } from "react-icons/fi";
import { FiBox } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FiBell } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import { FiTrendingUp } from "react-icons/fi";
import { FiDollarSign } from "react-icons/fi";
import { FiShoppingBag } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiPieChart } from "react-icons/fi";
import { FiBarChart2 } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import { Slide } from "react-toastify";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  // const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    Api.get("/products").then(res => setProducts(res.data));
    Api.get("/users").then(res => setUsers(res.data));
    Api.get("/orders").then(res => setOrders(res.data));
  }, []);

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.created_at);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });
  
  // Pie chart: products by category
  const categoryData = products.reduce((acc, p) => {
    const idx = acc.findIndex(c => c.name === p.category);
    if (idx >= 0) acc[idx].value += 1;
    else acc.push({ name: p.category, value: 1 });
    return acc;
  }, []);

  // Line chart: revenue trend (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return days;
  };

  const revenueData = getLast7Days().map(day => {
    const dayRevenue = orders.filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === day;
    }).reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    
    return { date: day, revenue: dayRevenue };
  });

  // Bar chart: stock levels (top 10 products)
  const stockData = products
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      stock: p.count,
    }));

  // Recent orders
  const recentOrders = orders.slice(0, 5);

  const COLORS = ["#0078D4", "#00B294", "#FFB900", "#E81123", "#5C2D91", "#1E88E5", "#D81B60", "#8E24AA", "#F57C00", "#43A047"];

  return (
    <>

    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Main Content Only - No Sidebar */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Noirel Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <FiBell className="text-xl" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                <FiUser />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">${totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-green-500 flex items-center mt-2">
                    <FiTrendingUp className="mr-1" /> 12.5% increase
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiDollarSign className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Products</p>
                  <p className="text-2xl font-bold mt-1">{products.length}</p>
                  <p className="text-sm text-gray-500 mt-2">Across {categoryData.length} categories</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiBox className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Users</p>
                  <p className="text-2xl font-bold mt-1">{users.length}</p>
                  <p className="text-sm text-green-500 flex items-center mt-2">
                    <FiTrendingUp className="mr-1" /> 8.2% growth
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiUsers className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Orders Today</p>
                  <p className="text-2xl font-bold mt-1">{todayOrders.length}</p>
                  <p className="text-sm text-gray-500 mt-2">${todayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toFixed(2)} revenue</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FiShoppingBag className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Data Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Revenue Overview</h3>
                <button className="flex items-center text-sm text-gray-500">
                  <FiCalendar className="mr-1" /> Last 7 days
                </button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0078D4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0078D4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#0078D4" fill="url(#colorRevenue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-6">Product Categories</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} products`, name]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Stock Levels and Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Levels */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-6">Stock Levels</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip 
                      formatter={(value) => [`${value} units`, 'Stock']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="stock" fill="#00B294" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Recent Orders</h3>
                <a href="/admin/orders" className="text-blue-600 text-sm hover:underline">View all</a>
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium">Order #{order._id?.substring(0, 8) || index}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.totalPrice?.toFixed(2) || '0.00'}</p>
                        <p className="text-sm text-gray-500">{order.status || 'Completed'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent orders</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
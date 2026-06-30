import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/userService";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function UserDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
      setRecentOrders(res.data.recentOrders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ─── VISUAL TRACKER COMPONENT ──────────────────────────────────────
  const OrderTracker = ({ currentStatus }) => {
    // 1. Handle Cancelled Status separately for visual clarity
    if (currentStatus === "Cancelled") {
      return (
        <div className="w-full min-w-[320px] max-w-md py-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-200 -translate-y-1/2 z-0 rounded"></div>
            
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-1.5 z-10 mx-auto">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">✕</span>
              <span className="text-xs font-bold text-red-600 tracking-wide uppercase">Order Cancelled</span>
            </div>
          </div>
        </div>
      );
    }

    // 2. Standard 5-Step Order Flow
    const steps = [
      { label: "Pending", key: "Pending" },
      { label: "Packed", key: "Packed" },
      { label: "Shipped", key: "Shipped" },
      { label: "Out for Delivery", key: "Out for Delivery" },
      { label: "Delivered", key: "Delivered" },
    ];

    // Find active step index based on current status string
    let activeIndex = steps.findIndex((step) => step.key === currentStatus);
    if (activeIndex === -1) activeIndex = 0; // Fallback defaults to pending

    return (
      <div className="w-full min-w-[350px] max-w-lg py-2">
        <div className="flex items-center justify-between relative">
          
          {/* Background Track Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded"></div>
          
          {/* Active Progress Highlight Line */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 transition-all duration-500 ease-in-out z-0 rounded"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          ></div>

          {/* Stepper Nodes */}
          {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;

            return (
              <div key={step.label} className="flex flex-col items-center relative z-10">
                {/* Node Circles */}
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : isActive
                      ? "bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                
                {/* Label text */}
                <span
                  className={`text-[10px] font-semibold mt-1 bg-white px-1 whitespace-nowrap ${
                    isActive ? "text-amber-600 font-bold" : isCompleted ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-medium text-gray-600">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Welcome 👋, {recentOrders[0]?.shippingAddress?.fullName || "User"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here is a quick look at your order statuses and spending info.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Orders</h3>
            <p className="text-4xl font-extrabold mt-2 text-gray-800">{stats?.totalOrders}</p>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pending Orders</h3>
            <p className="text-4xl font-extrabold mt-2 text-amber-500">{stats?.pendingOrders}</p>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Delivered Orders</h3>
            <p className="text-4xl font-extrabold mt-2 text-emerald-600">{stats?.deliveredOrders}</p>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Spent</h3>
            <p className="text-4xl font-extrabold mt-2 text-indigo-600">₹{stats?.totalSpent}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <p className="text-xs text-gray-400">Track and manage your live shipment timelines.</p>
          </div>

          {recentOrders?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 font-medium">No orders found yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/75">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Live Tracker</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-semibold text-indigo-600 text-sm">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="p-4 text-sm font-bold text-gray-700">
                        ₹{order.totalAmount}
                      </td>

                      {/* Interactive Tracker Column */}
                      <td className="p-4">
                        <OrderTracker currentStatus={order.orderStatus} />
                      </td>

                      <td className="p-4 text-xs font-medium text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
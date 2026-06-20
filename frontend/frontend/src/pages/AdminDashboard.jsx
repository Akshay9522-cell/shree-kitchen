import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/adminService";
import SalesChart from "../components/SalesCharts";
import RecentOrders from "./RecentOrder";
import TopProduct from "./TopProduct";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboardStats();
      // Safe assignment with a fallback structure depending on your API wrapper setup
      setStats(res.data?.stats || res.data || {
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        pendingOrders: 0,
        totalRevenue: 0,
      });
    } catch (error) {
      console.error("Dashboard metric fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <h2 className="text-sm font-medium text-gray-500">Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Dashboard Top Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time overview of your store's performance metrics.</p>
      </div>

      {/* Grid Statistics Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Products Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Products</h2>
            <p className="text-2xl font-bold mt-2 text-gray-900">{stats.totalProducts}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Orders</h2>
            <p className="text-2xl font-bold mt-2 text-gray-900">{stats.totalOrders}</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Revenue</h2>
            <p className="text-2xl font-bold mt-2 text-gray-900">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Pending Orders</h2>
            <p className="text-2xl font-bold mt-2 text-gray-900">{stats.pendingOrders}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Customers</h2>
            <p className="text-2xl font-bold mt-2 text-gray-900">{stats.totalUsers}</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
        </div>

      </div>

      {/* Breakout Information Table/List */}
      <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-3xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Metrics Breakdown</h2>
        <div className="divide-y divide-gray-100 text-sm">
          <div className="flex justify-between py-3 text-gray-600">
            <span>Active Products Listing</span>
            <span className="font-semibold text-gray-900">{stats.totalProducts} items</span>
          </div>
          <div className="flex justify-between py-3 text-gray-600">
            <span>Processed Transactions</span>
            <span className="font-semibold text-gray-900">{stats.totalOrders} invoices</span>
          </div>
          <div className="flex justify-between py-3 text-gray-600">
            <span>Awaiting Fulfillment</span>
            <span className="font-semibold text-amber-600">{stats.pendingOrders} orders</span>
          </div>
          <div className="flex justify-between py-3 text-gray-600">
            <span>Registered Accounts</span>
            <span className="font-semibold text-gray-900">{stats.totalUsers} profiles</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-base text-gray-900 pt-4">
            <span>Total Gross Revenue</span>
            <span className="text-indigo-600">₹{stats.totalRevenue.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <SalesChart />
        <RecentOrders/>
        <TopProduct/>
      </div>
    </div>
  );
}
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
      console.log(res.data.recentOrders)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8">
        {`Welcome  👋, ${recentOrders[0]?.shippingAddress?.fullName || "User"}`}
        
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">
            Total Orders
          </h3>

          <p className="text-3xl font-bold mt-2">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">
            Pending Orders
          </h3>

          <p className="text-3xl font-bold mt-2 text-yellow-500">
            {stats.pendingOrders}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">
            Delivered Orders
          </h3>

          <p className="text-3xl font-bold mt-2 text-green-600">
            {stats.deliveredOrders}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">
            Total Spent
          </h3>

          <p className="text-3xl font-bold mt-2 text-indigo-600">
            ₹{stats.totalSpent}
          </p>
        </div>

      </div>

      {/* Recent Orders */}
      <div className="mt-10 bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-4">
          Recent Orders
        </h2>

        {stats.recentOrders?.length === 0 ? (
          <p className="text-gray-500">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b bg-gray-50">

                  <th className="text-left p-3">
                    Order ID
                  </th>

                  <th className="text-left p-3">
                    Amount
                  </th>

                  <th className="text-left p-3">
                    Status
                  </th>

                  <th className="text-left p-3">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>

                {stats.recentOrders?.map(
                  (order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">
                        #{order._id.slice(-6)}
                      </td>

                      <td className="p-3">
                        ₹{order.totalAmount}
                      </td>

                      <td className="p-3">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.orderStatus ===
                            "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.orderStatus ===
                                "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>

                      </td>

                      <td className="p-3">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}
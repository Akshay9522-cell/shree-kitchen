import {
  useEffect,
  useState,
} from "react";

import {
  getRecentOrders,
} from "../services/adminService";

export default function RecentOrders() {

  const [orders, setOrders] =
    useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders =
    async () => {

      const res =
        await getRecentOrders();

      setOrders(
        res.data.orders
      );
    };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-4">
        Recent Orders
      </h2>

      <table className="w-full">

        <thead>
          <tr className="border-b">

            <th className="text-left p-2">
              Customer
            </th>

            <th className="text-left p-2">
              Amount
            </th>

            <th className="text-left p-2">
              Status
            </th>

          </tr>
        </thead>

        <tbody>

          {orders.map(
            (order) => (
              <tr
                key={order._id}
                className="border-b"
              >
                <td className="p-2">
                  {
                    order.user
                      ?.name
                  }
                </td>

                <td className="p-2">
                  ₹
                  {
                    order.totalAmount
                  }
                </td>

                <td className="p-2">
                  {
                    order.orderStatus
                  }
                </td>
              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}
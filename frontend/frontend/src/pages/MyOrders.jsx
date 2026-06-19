// src/pages/MyOrders.jsx

import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No Orders Found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded-xl p-5 mb-5"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold">
                  Order ID
                </h2>

                <p className="text-gray-500">
                  {order._id}
                </p>
              </div>

              <div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p>
                Payment:
                <strong>
                  {" "}
                  {order.paymentStatus}
                </strong>
              </p>

              <p>
                Total:
                <strong>
                  ₹{order.totalAmount}
                </strong>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
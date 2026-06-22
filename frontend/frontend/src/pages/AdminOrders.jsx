// src/pages/AdminOrders.jsx
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "../services/adminService";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      await updateOrderStatus(
        orderId,
        status
      );

      loadOrders();

      toast.success("Order Status Updated ✅");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-bold">
          Loading Orders...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-4xl font-bold mb-8">
        Admin Orders
      </h1>

      <div className="space-y-6">

        {orders.map((order) => (

          <div
            key={order._id}
            className="bg-white rounded-xl shadow-lg p-6"
          >

            <div className="flex justify-between items-center">

              <div>

                <h2 className="font-bold text-lg">
                  Order ID
                </h2>

                <p className="text-gray-500 break-all">
                  {order._id}
                </p>

                <p className="mt-2">
                  <strong>Customer:</strong>{" "}
                  {order.user?.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {order.user?.email}
                </p>

              </div>

              <div className="text-right">

                <p className="font-bold text-xl text-green-600">
                  ₹{order.totalAmount}
                </p>

                <p className="mt-2">
                  Payment:
                  <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded">
                    {order.paymentStatus}
                  </span>
                </p>

              </div>

            </div>

            <hr className="my-4" />

            <div>

              <h3 className="font-bold mb-2">
                Products
              </h3>

              {order.items.map((item) => (

                <div
                  key={item._id}
                  className="flex justify-between py-2"
                >

                  <span>
                    {item.product?.name}
                  </span>

                  <span>
                    Qty:
                    {" "}
                    {item.quantity}
                  </span>

                </div>

              ))}

            </div>

            <hr className="my-4" />

            <div className="flex justify-between items-center">

              <div>

                <p>
                  <strong>
                    Current Status:
                  </strong>
                  {" "}
                  {order.orderStatus}
                </p>

              </div>

              <select
                value={order.orderStatus}
                onChange={(e) =>
                  handleStatusChange(
                    order._id,
                    e.target.value
                  )
                }
                className="border p-2 rounded"
              >

                <option>
                  Pending
                </option>

                <option>
                  Confirmed
                </option>

                <option>
                  Packed
                </option>

                <option>
                  Shipped
                </option>

                <option>
                  Delivered
                </option>

                <option>
                  Cancelled
                </option>

              </select>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
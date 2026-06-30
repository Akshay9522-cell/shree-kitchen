import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMyOrders } from "../services/orderService";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res =
        await getMyOrders();

      setOrders(
        res.data.orders
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Packed":
        return "bg-purple-100 text-purple-700";

      case "Shipped":
        return "bg-orange-100 text-orange-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getPaymentColor =
    (status) => {
      return status === "Paid"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
    };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
  <Navbar/>
      <h1 className="text-4xl font-bold mb-8">
        My Orders
      </h1>

      <div className="space-y-6">

        {orders.map((order) => (

          <div
            key={order._id}
            className="bg-white rounded-xl shadow-md p-6"
          >

            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between">

              <div>
                <h2 className="font-bold text-lg">
                  Order #
                  {order._id.slice(-6)}
                </h2>

                <p className="text-gray-500 text-sm">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3 mt-3 md:mt-0">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentColor(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>

              </div>

            </div>

            {/* Products */}

            <div className="mt-6 space-y-4">

              {order.items.map(
                (item) => (

                  <div
                    key={item._id}
                    className="flex gap-4 border-b pb-4"
                  >

                    <img
                      src={
                        item.product.image[0]
                      }
                      alt={
                        item.product.name
                      }
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    <div>

                      <h3 className="font-semibold">
                        {
                          item.product
                            .name
                        }
                      </h3>

                      <p className="text-gray-500">
                        Qty:
                        {
                          item.quantity
                        }
                      </p>

                      <p className="font-bold">
                        ₹
                        {item.price}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* Timeline */}

            <div className="mt-6">

              <div className="flex flex-wrap gap-2">

                {[
                  "Pending",
                  "Confirmed",
                  "Packed",
                  "Shipped",
                  "Delivered",
                ].map(
                  (step) => (

                    <div
                      key={step}
                      className={`px-3 py-1 rounded-full text-sm ${
                        step ===
                        order.orderStatus
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {step}
                    </div>

                  )
                )}

              </div>

            </div>

            {/* Footer */}

            <div className="mt-6 flex justify-between items-center">

              <h3 className="text-xl font-bold">
                Total:
                ₹
                {
                  order.totalAmount
                }
              </h3>

              <p className="text-gray-500">
                {
                  order.paymentMethod
                }
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
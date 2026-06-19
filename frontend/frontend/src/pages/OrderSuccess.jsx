// src/pages/OrderSuccess.jsx

import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-green-600">
          🎉 Order Placed
        </h1>

        <p className="mt-4 text-gray-600">
          Your payment was successful.
        </p>

        <div className="mt-6 flex gap-4 justify-center">
          <Link
            to="/"
            className="bg-indigo-600 text-white px-5 py-2 rounded"
          >
            Continue Shopping
          </Link>

          <Link
            to="/my-orders"
            className="bg-green-600 text-white px-5 py-2 rounded"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
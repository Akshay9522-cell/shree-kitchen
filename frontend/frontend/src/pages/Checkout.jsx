import { useState } from "react";
import { placeOrder } from "../services/orderService";
import { createPaymentOrder, verifyPayment } from "../services/paymentService";
import { loadRazorpay } from "../utils/loadRazorpay";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Ensure Razorpay Script is Loaded
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      // 2. Create the Order in your Database
      console.log("Creating internal store order...");
      const orderRes = await placeOrder({
        shippingAddress: formData,
        paymentMethod: "ONLINE",
      });

      const orderId = orderRes?.data?.order?._id || orderRes?.order?._id;
      if (!orderId) {
        alert("Failed to create internal store order ID.");
        return;
      }
      console.log("ORDER CREATED:", orderId);

      // 3. Create Razorpay Order & Fetch Test API Key
      console.log("Initiating Razorpay server order...");
      const paymentRes = await createPaymentOrder(orderId);
      
      // Auto-extract logic in case your Axios service auto-unwraps the ".data" key
      const targetData = paymentRes?.data ? paymentRes.data : paymentRes;
      const { razorpayOrder, key } = targetData;

      console.log("Extracted API Key:", key);
      console.log("Extracted Razorpay Order Object:", razorpayOrder);

      if (!key || !razorpayOrder || !razorpayOrder.id) {
        alert("Configuration Error: Key or Order details missing from backend response.");
        return;
      }

      // 4. Construct Razorpay Configuration Options
      const options = {
        key: key,
        amount: razorpayOrder.amount, // Handled in paise from backend
        currency: razorpayOrder.currency || "INR",
        name: "Shree Kitchen",
        description: "Kitchen Storage Products",
        order_id: razorpayOrder.id,   // Must be the rzp_order_xxxx string
        
        // Prefill mock user data for a smoother UX
        prefill: {
          name: formData.fullName || "Test User",
          contact: formData.phone || "9999999999",
        },
        
        // Success Handler
        handler: async (response) => {
          console.log("Razorpay Checkout Success Response:", response);
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const verificationTarget = verifyRes?.data ? verifyRes.data : verifyRes;

            if (verificationTarget.success) {
              alert("Payment Successful 🎉");
              navigate("/my-orders");
            } else {
              alert("Payment verification failed on server side.");
            }
          } catch (verifyError) {
            console.error("Verification endpoint crashed:", verifyError);
            alert("Error trying to verify your signature backend.");
          }
        },
        
        // Modal customization
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: function () {
            console.log("User closed the checkout popup without paying.");
          }
        }
      };

      // 5. Open Checkout Modal
      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error("Checkout process caught an error:", error);
      alert(error?.response?.data?.message || error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          placeholder="Full Name"
          required
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <input
          name="phone"
          placeholder="Phone"
          required
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <input
          name="address"
          placeholder="Address"
          required
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <input
          name="city"
          placeholder="City"
          required
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <input
          name="state"
          placeholder="State"
          required
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <input
          name="pincode"
          placeholder="Pincode"
          required
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <button className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors">
          Place Order
        </button>
      </form>
    </div>
  );
}
import { useState } from "react";
import { placeOrder } from "../services/orderService";
import { createPaymentOrder,  verifyPayment } from "../services/paymentService";
import { loadRazorpay } from "../utils/loadRazorpay";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, Phone, User, ArrowRight, ShieldCheck } from "lucide-react";

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

  // Local state for field-level error validations
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Real-time error validation logic
  const validateField = (name, value) => {
    let errorMsg = "";
    if (!value.trim()) {
      errorMsg = "This field is required";
    } else {
      if (name === "phone") {
        // Simple regex matching Indian 10-digit phone standards
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ""))) {
          errorMsg = "Enter a valid 10-digit mobile number";
        }
      }
      if (name === "pincode") {
        // Regex checking for valid 6 digit Indian pincode string
        const pinRegex = /^[1-9][0-9]{5}$/;
        if (!pinRegex.test(value.trim())) {
          errorMsg = "Enter a valid 6-digit Pincode";
        }
      }
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field specific error markers dynamically as the user fixes them
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateAllFormFields = () => {
    const currentErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) currentErrors[key] = error;
    });
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trigger explicit validation checks before executing payments gateway
    if (!validateAllFormFields()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        alert("Please fix the validation errors in the form before proceeding.");
      }
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Ensure Razorpay Script is Loaded
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      // 2. Create the Order in your Database
      const orderRes = await placeOrder({
        shippingAddress: formData,
        paymentMethod: "ONLINE",
      });

      const orderId = orderRes?.data?.order?._id || orderRes?.order?._id;
      if (!orderId) {
        alert("Failed to create internal store order ID.");
        return;
      }

      // 3. Create Razorpay Order & Fetch Test API Key
      const paymentRes = await createPaymentOrder(orderId);
      const targetData = paymentRes?.data ? paymentRes.data : paymentRes;
      const { razorpayOrder, key } = targetData;

      if (!key || !razorpayOrder || !razorpayOrder.id) {
        alert("Configuration Error: Key or Order details missing from backend response.");
        return;
      }

      // 4. Construct Razorpay Configuration Options
      const options = {
        key: key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Shree Kitchen",
        description: "Kitchen Storage Products",
        order_id: razorpayOrder.id,
        prefill: {
          name: formData.fullName || "Customer",
          contact: formData.phone || "",
        },
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const verificationTarget = verifyRes?.data ? verifyRes.data : verifyRes;

            if (verificationTarget.success) {
              navigate("/order-success");
            } else {
              alert("Payment verification failed on server side.");
            }
          } catch (verifyError) {
            console.error("Verification endpoint crashed:", verifyError);
            alert("Error trying to verify your signature backend.");
          }
        },
        theme: {
          color: "#4F46E5", // Matches smooth Indigo theme
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            console.log("User closed checkout pop-up.");
          }
        }
      };

      // 5. Open Checkout Modal
      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error("Checkout error:", error);
      alert(error?.response?.data?.message || error.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 antialiased flex flex-col justify-center">
      <div className="max-w-xl w-full mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100 p-6 md:p-10 space-y-8">
        
        {/* Header Summary */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Shipping Details</h1>
          <p className="text-sm text-slate-500">Please supply valid destination parameters to process checkout execution assets.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name field frame */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={`w-full bg-slate-50 border ${errors.fullName ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-500"} rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition duration-150`}
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.fullName && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.fullName}</p>}
          </div>

          {/* Contact Mobile field frame */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Mobile Number</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className={`w-full bg-slate-50 border ${errors.phone ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-500"} rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition duration-150`}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.phone && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.phone}</p>}
          </div>

          {/* Core Street Address block field frame */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Street Address</label>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Flat / House No, Apartment, Street Name"
                className={`w-full bg-slate-50 border ${errors.address ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-500"} rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition duration-150`}
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.address && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.address}</p>}
          </div>

          {/* Dual Split Fields grid (City & State) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                className={`w-full bg-slate-50 border ${errors.city ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-500"} rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition duration-150`}
              />
              {errors.city && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.city}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Maharashtra"
                className={`w-full bg-slate-50 border ${errors.state ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-500"} rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition duration-150`}
              />
              {errors.state && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.state}</p>}
            </div>
          </div>

          {/* Regional Postal Pincode block field frame */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Postal Pincode</label>
            <input
              type="text"
              maxLength="6"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="400001"
              className={`w-full bg-slate-50 border ${errors.pincode ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-500"} rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition duration-150`}
            />
            {errors.pincode && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.pincode}</p>}
          </div>

          {/* Checkout Submit CTA Trigger action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-medium py-3.5 rounded-xl transition duration-150 text-sm shadow-md shadow-slate-950/10 flex items-center justify-center gap-2 group cursor-pointer disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing Secure Connection..." : "Proceed to Secure Payment"}
              {!isProcessing && <ArrowRight className="w-4 h-4 text-white/80 transition-transform group-hover:translate-x-1" />}
            </button>
          </div>
        </form>

        {/* Security parameters Trust Badge row */}
        <div className="border-t border-slate-100 pt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>256-bit encrypted secure checkout connection via Razorpay.</span>
        </div>

      </div>
    </div>
  );
}
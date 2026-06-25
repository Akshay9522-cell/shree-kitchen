import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import API from "../services/api";
import { toast } from "react-hot-toast"; 
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Dynamic field-level error rules
  const validateField = (name, value) => {
    let errorMsg = "";
    if (!value.trim()) {
      errorMsg = "This field is required";
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = "Please enter a valid email address";
      }
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation warnings dynamically
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const currentErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) currentErrors[key] = error;
    });
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  // 1. Traditional Email/Password Submit Pipeline
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      setLoading(true);
      const res = await API.post("/auth/login", formData);

      // Connects cleanly to your AuthContext parameters
      login(res.data.token, res.data.user); 

      toast.success("Login Successful ✅");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // 2. Google OAuth Handshake Authentication Pipeline
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        
        // Exchanging the google access token with your backend server
        const res = await API.post("/auth/google-login", {
          googleToken: tokenResponse.access_token,
        });

        // Safe authorization assignment via your existing context structure
        login(res.data.token, res.data.user);

        toast.success("Logged in with Google successfully 🎉");
        navigate("/");
      } catch (error) {
        console.error("Google verify crash: ", error);
        toast.error(error.response?.data?.message || "Google Authentication Failed");
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google popup error: ", errorResponse);
      toast.error("Failed to interface with Google authentication streams.");
    },
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 antialiased flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100 p-6 md:p-10 space-y-8">
        
        {/* Identity Headings */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-2.5 bg-indigo-50 rounded-xl text-indigo-600 mb-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Welcome Back</h1>
          <p className="text-xs text-slate-400">Log in to safely manage your premium storage setups.</p>
        </div>

        {/* Form Fields layout wrapper */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`w-full bg-slate-50 border ${errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-500"} rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition duration-150`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
              <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border ${errors.password ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-500"} rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition duration-150`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.password && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-medium py-3.5 rounded-xl transition duration-150 text-sm shadow-md shadow-slate-950/10 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating Client Data..." : "Sign In"}
            {!loading && <LogIn className="w-4 h-4" />}
          </button>
        </form>

        {/* Visual Classic Split Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 w-full" />
          <span className="absolute bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-semibold">Or continue with</span>
        </div>

        {/* Google Authentication Trigger Button */}
        <div>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleGoogleLogin()}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold py-3 rounded-xl transition duration-150 text-sm flex items-center justify-center gap-2.5 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.014c1.49 0 2.845.543 3.9 1.432l3.23-3.23A10.16 10.16 0 0 0 13.99 2 10.5 10.5 0 0 0 3.5 12.5a10.5 10.5 0 0 0 10.49 10.5c5.774 0 10.41-4.148 10.41-10.5 0-.534-.047-1.048-.13-1.542H12.24Z"
              />
            </svg>
            Continue with Gmail
          </button>
        </div>

        {/* Account redirection link tracking tier */}
        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{" "}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Search, ShoppingCart, LogIn, Home, User, LogOut } from "lucide-react";
import { getCart } from "../services/cartService";
import { AuthContext } from "../context/AuthContext"; 
import toast from "react-hot-toast";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getCart();
        const items = res.data?.cart?.items || [];
        const total = items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(total);
      } catch (err) {
        console.log("Navbar cart badge sync error:", err);
      }
    };

    fetchCount();
    window.addEventListener("cart-updated", fetchCount);

    return () => {
      window.removeEventListener("cart-updated", fetchCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?keyword=${search}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-900 px-3 min-[360px]:px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-[360px]:gap-4 md:gap-8">
        
        {/* Branding Logo - Dynamically scales font down to fit perfectly on 320px viewports */}
        <Link to="/" className="text-base min-[360px]:text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 shrink-0">
          Shree Kitchen
        </Link>

        {/* Search Bar Form hidden for mobile visibility limits */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg relative hidden sm:block"></form>

        {/* Action Button Links Group */}
        <div className="flex items-center gap-1.5 min-[360px]:gap-2 md:gap-4 shrink-0">
          
          {/* Home Nav Link */}
          <Link to="/" className="p-1.5 min-[360px]:p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900/50 transition duration-200 flex items-center gap-1 text-xs min-[360px]:text-sm font-medium">
            <Home className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">Home</span>
          </Link>

          {/* Cart Badge Button Link */}
          <Link to="/cart" className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900/50 transition duration-200 relative group">
            <ShoppingCart className="w-4 h-4 min-[360px]:w-5 min-[360px]:h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[9px] font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* USER AUTH CONDITIONAL MODULE CONTROL */}
          {user ? (
            <div className="flex items-center gap-1 min-[360px]:gap-2">
              
              {/* User Dashboard Profile Chip: Handles wide name string truncations smoothly */}
              <Link 
                to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} 
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-[11px] min-[360px]:text-sm font-medium px-2.5 min-[360px]:px-3 py-1.5 min-[360px]:py-2 rounded-xl transition duration-200 flex items-center gap-1.5 max-w-[100px] min-[360px]:max-w-[140px]"
              >
                <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">
                  {user.name ? user.name.split(" ")[0] : "User"}
                </span>
              </Link>

              {/* Logout Action Controller Button */}
              <button 
                onClick={handleLogout}
                className="p-1.5 min-[360px]:p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition duration-200 shrink-0"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4" />
              </button>

            </div>
          ) : (
            /* Login Form Button Link Redirect */
            <Link to="/login" className="bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-500 text-indigo-400 hover:text-white text-xs min-[360px]:text-sm font-semibold px-3 min-[360px]:px-4 py-1.5 min-[360px]:py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shrink-0">
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}
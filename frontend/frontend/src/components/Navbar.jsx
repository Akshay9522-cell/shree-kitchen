import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, LogIn, Home } from "lucide-react";
import { getCart } from "../services/cartService";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Fetch count on load (or sync via state/events depending on architecture setup)
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

  // 4. Clean up the event listener when the component unmounts to prevent memory leaks
  return () => {
    window.removeEventListener("cart-updated", fetchCount);
  };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?keyword=${search}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-900 px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Branding Logo */}
        <Link to="/" className="text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 shrink-0">
          Shree Kitchen
        </Link>

        {/* Professional Glowing Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg relative hidden sm:block">
          {/* <input
            type="text"
            placeholder="Search premium kitchenware..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
          /> */}
          {/* <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" /> */}
        </form>

        {/* Premium Control Hub Options */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/" className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900/50 transition duration-200 flex items-center gap-1.5 text-sm font-medium">
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Home</span>
          </Link>

          {/* Dynamic Badge Counter Anchor Row */}
          <Link to="/cart" className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900/50 transition duration-200 relative group">
            <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            
            {/* Real-time Dynamic Counter Badge Floating Indicator */}
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md shadow-indigo-500/20 animate-scale-in">
                {cartCount}
              </span>
            )}
          </Link>
          
          <Link to="/login" className="ml-2 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-500 text-indigo-400 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
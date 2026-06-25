import { useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem } from "../services/cartService";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, ShieldCheck } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data?.cart?.items || []);
    } catch (error) {
      console.error("Cart retrieval fault index:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (item) => {
    await updateCartItem(item.product._id, item.quantity + 1);
    loadCart();
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;
    await updateCartItem(item.product._id, item.quantity - 1);
    loadCart();
  };

  const handleRemove = async (item) => {
    await removeCartItem(item.product._id);
    loadCart();
    window.dispatchEvent(new Event("cart-updated"));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] bg-slate-950 text-slate-100">
      
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-xs text-slate-400 tracking-wide font-medium">Validating Checkout Inventory...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-5 text-indigo-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">Looks like you haven't reserved any premium cookware items yet.</p>
          <Link to="/" className="inline-flex w-full justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 relative">
      
      {/* Decorative ambient blurred backing lights */}
      <div className="absolute top-10 left-5 w-72 h-72 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-5 w-96 h-96 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        <h1 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
          Shopping Cart
          <span className="text-xs bg-slate-900 text-slate-400 px-2.5 py-1 rounded-md border border-slate-800 font-medium">{totalItems} items</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left: Cart Items Sheet List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-4 shadow-xl hover:border-slate-700/60 transition duration-200 group relative"
              >
                {/* Product Image Window */}
                <div className="w-full sm:w-28 h-28 shrink-0 bg-slate-950 rounded-xl overflow-hidden mb-4 sm:mb-0 border border-slate-800/40 p-2 flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-auto max-w-full object-contain mix-blend-lighten group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Detail Configuration Data Column */}
                <div className="sm:ml-6 flex flex-col justify-between flex-1 w-full">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-base md:text-lg font-bold text-white tracking-tight hover:text-indigo-400 transition cursor-pointer">
                        {item.product.name}
                      </h2>
                      <p className="text-base md:text-lg font-extrabold text-white shrink-0">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Unit Value: ₹{item.product.price}</p>
                  </div>

                  {/* Quantity Actions & Custom Trash Trigger Footer */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800/40">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Qty:</span>
                      <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 gap-1">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/60 transition disabled:opacity-40"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="font-bold text-sm px-3 text-white min-w-[24px] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleIncrease(item)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-150 border border-transparent hover:border-rose-500/20"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Right: Order Pricing Summary Glass Card */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-xl lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-slate-800/80 tracking-tight">
              Order Summary
            </h2>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Items reserved ({totalItems})</span>
                <span className="font-medium text-slate-200">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Processing</span>
                <span className="text-emerald-400 font-bold tracking-wide text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">FREE</span>
              </div>
              
              <hr className="border-slate-800/80 my-4" />
              
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-base font-bold text-white">Total Amount</span>
                <span className="text-2xl font-black text-emerald-400 tracking-tight">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Standard Safety Validation Tagline */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
              <span>Secure Gateway Transacting Enabled</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
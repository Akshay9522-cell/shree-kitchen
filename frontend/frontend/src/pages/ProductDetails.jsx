import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag, ShieldCheck, ArrowLeft, Layers, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { addToCart, getCart } from "../services/cartService";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.product);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load product details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      // 1. Fetch the latest items directly from your cart service
      const res = await getCart();
      const currentItems = res.data?.cart?.items || [];

      // 2. Scan the current items to check if this product id already exists
      const isAlreadyInCart = currentItems.some(
        (item) => item.product?._id === product._id
      );

      if (isAlreadyInCart) {
        toast.error("Product is already in your cart! 🛒");
        return; // Halt execution early
      }

      // 3. Otherwise, proceed to add the item
      await addToCart(product._id, 1);
      toast.success("Product Added To Cart ✅");
      
      // Instantly updates the count in the glass navbar
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error(error);
      toast.error("Please login first");
      navigate("/login"); // Redirect to login if not authenticated
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-xs text-slate-400 tracking-wide font-medium">Inspecting Inventory Files...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Item Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">The requested kitchen asset could not be located.</p>
          <Link to="/" className="inline-flex justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-xl border border-slate-800 transition duration-200">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Calculate savings discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 relative overflow-x-hidden">
      
      {/* Ambient background textures */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Navigation Breadcrumb Back Trigger */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white mb-8 group transition-colors">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Catalogue
        </Link>

        {/* Primary Product Segment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Left Frame: Premium Interactive Image Display Box */}
          <div className="relative rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 p-6 flex items-center justify-center shadow-2xl group overflow-hidden aspect-square">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
            <img
              src={product.image}
              alt={product.name}
              className="rounded-xl max-h-full max-w-full object-contain mix-blend-lighten transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Right Frame: Specifications & Operational Directives Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                <Sparkles className="w-3 h-3" /> Premium Collection
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light">
              {product.description || "No customized layout technical specification descriptions have been updated for this item asset block."}
            </p>

            {/* Custom Specification Data Matrix */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Capacity</span>
                <span className="text-sm font-semibold text-slate-200">{product.capacity || "Standard Setup"}</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Material Composition</span>
                <span className="text-sm font-semibold text-slate-200">{product.material || "Certified Grade"}</span>
              </div>
            </div>

            {/* Price Segment Breakdown Block */}
            <div className="flex items-baseline gap-4 pt-4 border-t border-slate-900">
              <span className="text-3xl md:text-4xl font-black text-emerald-400 tracking-tight">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-slate-500 line-through font-medium">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Master Action Trigger Hub */}
            <div className="pt-4 space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-3 group"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
                <span>Secure Allocation To Cart</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
                <span>Quality Tested Kitchenware Hardware Guarantee</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
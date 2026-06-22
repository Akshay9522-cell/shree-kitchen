import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Search, SlidersHorizontal, Sliders, ChevronLeft, ChevronRight, 
  ShoppingBag, Sparkles, Star, ShieldCheck, ArrowRight, Truck, RefreshCw, PhoneCall
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] = useState("");
  
  // Pagination Tracking States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Real-time typed max price inputs
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");

  const currentKeyword = searchParams.get("keyword") || "";
  const [searchInput, setSearchInput] = useState(currentKeyword);

  const categories = [
    { id: "", name: "All Categories" },
    { id: "Storage Containers", name: "Storage Containers" },
    { id: "Water Bottles", name: "Water Bottles" },
  ];

  // Sync state if keyword changes from navbar search bar
  useEffect(() => {
    setSearchInput(currentKeyword);
  }, [currentKeyword]);

  // Reset page marker back to index 1 if structural filter metrics change
  useEffect(() => {
    setPage(1);
  }, [currentKeyword, selectedCategory, sort, debouncedMaxPrice]);

  // --- COMBINED DEBOUNCE EFFECT (SEARCH & PRICE) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput.trim()) {
        setSearchParams({ keyword: searchInput });
      } else {
        const params = new URLSearchParams(searchParams);
        params.delete("keyword");
        setSearchParams(params);
      }
      setDebouncedMaxPrice(maxPriceInput);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, maxPriceInput, setSearchParams]);

  // --- API DATA FETCH EFFECT ---
  useEffect(() => {
    fetchProducts();
  }, [currentKeyword, selectedCategory, sort, debouncedMaxPrice, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/products?keyword=${currentKeyword}&category=${selectedCategory}&sort=${sort}&maxPrice=${debouncedMaxPrice}&page=${page}`
      );
      setProducts(res.data?.products || res.data || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error("Failed fetching product registry items:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setMaxPriceInput("");
    setSelectedCategory("");
    setSort("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col overflow-x-hidden antialiased">
      
      {/* ─── HERO SECTION (Soft Warm Glow Gradient) ─── */}
      <section className="relative pt-24 pb-20 md:py-32 flex items-center justify-center border-b border-slate-200/60 bg-gradient-to-b from-amber-50/40 via-indigo-50/20 to-slate-50/60">
        {/* Soft atmospheric radial gradients */}
        <div className="absolute top-12 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-200/30 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-100/70 border border-amber-200 px-3.5 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Beautifully Crafted for Modern Kitchens
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
            Elevate Your Space With <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500">
              Premium Culinary Living
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-500 font-normal leading-relaxed">
            Discover Shree Kitchen's collection of sleek, hyper-durable storage systems and premium insulated premium flasks. Minimalist designs meeting everyday performance.
          </p>
          <div className="pt-2">
            <a href="#shop" className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-medium px-8 py-3.5 rounded-xl transition duration-200 shadow-md shadow-slate-950/10 text-sm group">
              Shop Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── FEATURES BAR (Smooth Pastel Accent Boxes) ─── */}
      <section className="bg-white border-b border-slate-100 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100 transition hover:bg-slate-50">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600"><Truck className="w-5 h-5" /></div>
            <div><h4 className="text-sm font-bold text-slate-900">Pan-India Shipping</h4><p className="text-xs text-slate-500">Free delivery on premium items</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100 transition hover:bg-slate-50">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600"><ShieldCheck className="w-5 h-5" /></div>
            <div><h4 className="text-sm font-bold text-slate-900">Lifetime Guarantee</h4><p className="text-xs text-slate-500">100% food-safe certified grade</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100 transition hover:bg-slate-50">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><RefreshCw className="w-5 h-5" /></div>
            <div><h4 className="text-sm font-bold text-slate-900">Seamless Returns</h4><p className="text-xs text-slate-500">Hassle-free 7-day exchange window</p></div>
          </div>
        </div>
      </section>

      {/* ─── MAIN STOREFRONT LAYOUT ─── */}
      <main id="shop" className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* LEFT SIDEBAR: SMOOTH MINIMALIST FILTER PANEL */}
          <aside className="space-y-6 lg:sticky lg:top-24 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Filter Options
              </h3>
              {(searchInput || maxPriceInput || selectedCategory || sort) && (
                <button onClick={clearAllFilters} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition">
                  Clear All
                </button>
              )}
            </div>

            {/* Live Search Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black-800 uppercase tracking-wider">Search Catalog</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Type keywords..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition duration-200"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Sorting Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black-800  uppercase tracking-wider">Sort Products</label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-10 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
                >
                  <option value="">Relevance</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
                <Sliders className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Price Budget Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black-800 uppercase tracking-wider">Max Budget Limit</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  placeholder="Enter dynamic ceiling price..."
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-7 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Categories Stack */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-black-800  uppercase tracking-wider">Product Category</label>
              <div className="flex flex-col gap-1.5">
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`text-left px-3 py-2.5 text-xs rounded-xl border transition-all duration-150 flex items-center justify-between ${
                        isActive
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold shadow-xs"
                          : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{category.name}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT VIEWPORT: PRODUCT ITEMS GRID */}
          <div className="lg:col-span-3 space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse space-y-4">
                    <div className="bg-slate-100 h-48 w-full rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white border border-slate-200/60 rounded-2xl p-8 max-w-md mx-auto shadow-xs">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No products found</h3>
                <p className="text-xs text-slate-500 mt-1">We couldn't track down matching results. Try clearing some search parameters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-all duration-300 flex flex-col cursor-pointer hover:shadow-xl hover:shadow-slate-200/60"
                  >
                    {/* Clean White Product Frame Box */}
                    <div className="relative aspect-square bg-slate-50/50 p-6 flex items-center justify-center overflow-hidden border-b border-slate-100">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600"}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 border border-slate-100 px-2 py-0.5 rounded-lg text-[10px] text-amber-600 font-bold shadow-xs">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 4.8
                      </div>
                    </div>

                    {/* Meta Info Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h2 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1 group-hover:text-indigo-600 transition duration-150">
                          {product.name}
                        </h2>
                        <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {product.capacity || "Standard Capacity Size"}
                        </span>
                      </div>
                      
                      {/* Price Matrix Trigger layout */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-emerald-600 text-lg font-bold tracking-tight">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-slate-400 text-xs line-through">
                              ₹{product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition duration-200 border border-slate-200/60 group-hover:border-indigo-500 shadow-xs">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION LINKS FRAME ROW */}
            {products.length > 0 && (
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200/60 w-full">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                  Page {page} / {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── SOFT LUMINANCE BRAND FOOTER ─── */}
  <footer className="bg-slate-950 border-t border-slate-900 mt-20">

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="space-y-4 md:col-span-2">

            <h2 className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">

              Shree Kitchen

            </h2>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">

              Premium storefront cataloging precision components for professional culinary storage configurations. Built for enduring domestic service cycles.

            </p>

          </div>

          <div className="space-y-3">

            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h4>

            <ul className="space-y-1.5 text-xs text-slate-500">

              <li><button onClick={() => setSelectedCategory("Storage Containers")} className="hover:text-slate-300 transition">Storage Containers</button></li>

              <li><button onClick={() => setSelectedCategory("Water Bottles")} className="hover:text-slate-300 transition">Water Bottles</button></li>

              <li><button onClick={() => setSelectedCategory("")} className="hover:text-slate-300 transition">All Product Vaults</button></li>

            </ul>

          </div>

          <div className="space-y-3">

            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact & Support</h4>

            <div className="flex items-center gap-2 text-xs text-slate-500">

              <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />

              <span>support@shreekitchen.com</span>

            </div>

            <p className="text-[11px] text-slate-600">Available Mon-Fri | 9:00 AM - 6:00 PM IST</p>

          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">

          <span>&copy; {new Date().getFullYear()} Shree Kitchen Systems. All Rights Reserved.</span>

          <span className="flex gap-4"><span>Privacy Policy</span><span>Terms of Service</span></span>

        </div>

      </footer>

    </div>
  );
}
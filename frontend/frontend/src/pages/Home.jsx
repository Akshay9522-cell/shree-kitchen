import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    { id: "", name: "All Products" },
    { id: "Storage Containers", name: "Storage Containers" },
    { id: "Water Bottles", name: "Water Bottles" },
  ];

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
        searchParams.delete("keyword");
        setSearchParams(searchParams);
      }
      setDebouncedMaxPrice(maxPriceInput);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, maxPriceInput, setSearchParams, searchParams]);

  // --- API DATA FETCH EFFECT ---
  // FIXED: Added 'page' to tracking matrix array safely
  useEffect(() => {
    fetchProducts();
  }, [currentKeyword, selectedCategory, sort, debouncedMaxPrice, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // FIXED: Swapped typo comma (,) for correct standard API ampersand (&) separation
      const res = await API.get(
        `/products?keyword=${currentKeyword}&category=${selectedCategory}&sort=${sort}&maxPrice=${debouncedMaxPrice}&page=${page}`
      );
      
      setProducts(res.data?.products || res.data || []);
      // FIXED: Safely extracting dynamic maximum ceiling count limits from server
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error("Failed fetching product registry items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col justify-between">
      
      <div>
        {/* Brand Header */}
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shree Kitchen</h1>
          <p className="text-sm text-gray-500 mt-2">Explore elite culinary systems and storage essentials seamlessly.</p>
        </div>

        {/* --- INTEGRATED FILTER AND SEARCH DASHBOARD HUB PANEL --- */}
        <div className="max-w-3xl mx-auto bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs mb-10 space-y-4">
          
          {/* Row 1: Main Text Live Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search our catalog instantly..."
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Row 2: Secondary Controls (Sorting Dropdown, Max Price Filter Input) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Custom Styled Sort Dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full appearance-none bg-gray-50/50 border border-gray-200 rounded-xl p-3 pr-10 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="">Sort By: Relevance</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Styled Numeric Max Price Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-semibold text-sm">
                ₹
              </div>
              <input
                type="number"
                placeholder="Max Price budget..."
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

          </div>

          {/* Row 3: Modular Category Pill Buttons */}
          <div className="pt-2 border-t border-gray-100 flex gap-2 justify-center flex-wrap">
            {categories.map((category) => {
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition duration-150 cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

        </div>

        {/* --- PRODUCT GRID SYSTEM VIEW PORT --- */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse space-y-4">
                  <div className="bg-gray-200 h-48 w-full rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-sm w-3/4" />
                    <div className="h-3 bg-gray-200 rounded-sm w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl p-6 max-w-md mx-auto shadow-xs">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-base font-bold text-gray-900">No products found</h3>
              <p className="text-sm text-gray-500 mt-1">We couldn't find anything matching your filters. Try adjusting your parameters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden hover:shadow-md hover:-translate-y-1 transition duration-200 flex flex-col cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600"}
                      alt={product.name}
                      className="h-48 w-full object-cover bg-gray-50 group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-200" />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-indigo-600 transition duration-150">
                        {product.name}
                      </h2>
                      <p className="text-gray-400 text-xs mt-0.5 font-medium uppercase tracking-wide">
                        {product.capacity || "Standard Size"}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-baseline space-x-2">
                      <span className="text-emerald-600 text-lg font-extrabold">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-400 text-xs line-through">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- PRESET INTERACTIVE PAGINATION CONTROLS PANEL --- */}
      {products.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-gray-200/60 max-w-7xl mx-auto w-full">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center space-x-1 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl bg-white text-gray-600 shadow-2xs transition duration-150 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            <span>Previous</span>
          </button>

          <span className="text-sm font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200/30">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="flex items-center space-x-1 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl bg-white text-gray-600 shadow-2xs transition duration-150 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 cursor-pointer"
          >
            <span>Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

    </div>
  );
}
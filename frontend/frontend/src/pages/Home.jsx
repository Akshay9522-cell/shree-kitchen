import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Search, SlidersHorizontal, Sliders, ChevronLeft, ChevronRight, 
  ShoppingBag, Sparkles, Star, ShieldCheck, ArrowRight, Truck, RefreshCw, PhoneCall
} from "lucide-react";
import Navbar from "../components/Navbar";

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
  const [heroIndex, setHeroIndex] = useState(0);

const HERO_VISIBLE_COUNT = 2;

const heroProducts = products;

const nextHeroProducts = () => {
  if (heroProducts.length <= HERO_VISIBLE_COUNT) return;

  setHeroIndex((prev) =>
    prev + HERO_VISIBLE_COUNT >= heroProducts.length
      ? 0
      : prev + 1
  );
};

const prevHeroProducts = () => {
  if (heroProducts.length <= HERO_VISIBLE_COUNT) return;

  setHeroIndex((prev) =>
    prev === 0
      ? Math.max(heroProducts.length - HERO_VISIBLE_COUNT, 0)
      : prev - 1
  );
};

  return (
    <>
    <Navbar/>

    {/* Scoped keyframes + reduced-motion guard. Purely additive — no existing classes touched. */}
    <style>{`
      @keyframes skFadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes skFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes skFloatA {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(12px, -14px) scale(1.05); }
      }
      @keyframes skFloatB {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-14px, 10px) scale(1.06); }
      }
      @keyframes skShimmer {
        0% { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      @keyframes skPop {  
        0% { transform: scale(0.85); opacity: 0; }
        60% { transform: scale(1.03); opacity: 1; }
        100% { transform: scale(1); }
      }

      .sk-blob-a { animation: skFloatA 9s ease-in-out infinite; }
      .sk-blob-b { animation: skFloatB 11s ease-in-out infinite; }

      .sk-hero-badge { opacity: 0; animation: skFadeUp 0.7s ease-out 0.05s forwards; }
      .sk-hero-title { opacity: 0; animation: skFadeUp 0.8s ease-out 0.18s forwards; }
      .sk-hero-copy  { opacity: 0; animation: skFadeUp 0.8s ease-out 0.32s forwards; }
      .sk-hero-cta   { opacity: 0; animation: skFadeUp 0.8s ease-out 0.46s forwards; }

      .sk-feature { opacity: 0; animation: skFadeUp 0.6s ease-out forwards; }

      .sk-card {
        opacity: 0;
        animation: skFadeUp 0.55s ease-out forwards;
      }

      .sk-skeleton {
        background-image: linear-gradient(90deg, rgba(148,163,184,0.12) 0px, rgba(148,163,184,0.28) 40px, rgba(148,163,184,0.12) 80px);
        background-size: 400px 100%;
        animation: skShimmer 1.4s ease-in-out infinite;
      }

      .sk-empty { animation: skPop 0.5s ease-out; }

      .sk-page-indicator { transition: opacity 0.25s ease; }

      @media (prefers-reduced-motion: reduce) {
        .sk-blob-a, .sk-blob-b, .sk-hero-badge, .sk-hero-title, .sk-hero-copy,
        .sk-hero-cta, .sk-feature, .sk-card, .sk-skeleton, .sk-empty {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>

    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col overflow-x-hidden antialiased">
      
      {/* ─── HERO SECTION (Soft Warm Glow Gradient) ─── */}
      <section   className="relative pt-24 pb-20 md:py-32 flex items-center justify-center border-b border-slate-200/60 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/images/image.png')" }}>
        {/* Soft atmospheric radial gradients — now gently animated */}
        <div className="sk-blob-a absolute top-12 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-[120px] pointer-events-none" />
        <div className="sk-blob-b absolute bottom-4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-200/30 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center z-10 space-y-6">
          <span className="sk-hero-badge inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-100/70 border border-amber-200 px-3.5 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Beautifully Crafted for Modern Kitchens
          </span>
          <h1 className="sk-hero-title text-4xl sm:text-6xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
            Elevate Your Space With <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500">
              Premium Culinary Living
            </span>
          </h1>
          <p className="sk-hero-copy max-w-2xl mx-auto text-sm md:text-base text-slate-500 font-normal leading-relaxed">
            Discover Shree Kitchen's collection of sleek, hyper-durable storage systems and premium insulated premium flasks. Minimalist designs meeting everyday performance.
          </p>
          <div className="sk-hero-cta pt-2">
            <a href="#shop" className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-medium px-8 py-3.5 rounded-xl transition duration-200 shadow-md shadow-slate-950/10 text-sm group hover:shadow-lg hover:shadow-slate-950/20 hover:-translate-y-0.5 active:translate-y-0">
              Shop Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

{/* ================= HERO SECTION ================= */}
<section className="relative w-full bg-[#fdf7f4] overflow-hidden border-b border-slate-100">

  <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">

    <div className="min-h-[500px] lg:min-h-[560px] flex items-center">

      <div className="w-full grid grid-cols-1 lg:grid-cols-[0.95fr_1.25fr] gap-10 lg:gap-14 items-center py-12 sm:py-16 lg:py-20">

        {/* ================= LEFT CONTENT ================= */}
        <div className="max-w-xl">

          <p className="text-sm sm:text-base text-slate-500 mb-4 font-medium">
            Premium Kitchen Collection
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] leading-[1.05] font-serif font-medium text-[#123535] tracking-tight">
            Beautiful Kitchen
            <br />

            <span className="text-[#173d3c]">
              Essentials
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm sm:text-base lg:text-lg leading-7 text-slate-500">
            Discover our collection of premium kitchen storage
            products designed to bring elegance, organization and
            everyday convenience to your home.
          </p>

          <button
            onClick={() => {
              document
                .getElementById("shop")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="
              mt-7
              inline-flex
              items-center
              justify-center
              px-7
              py-3.5
              rounded-lg
              bg-[#123b3a]
              text-white
              text-sm
              font-semibold
              hover:bg-[#0d2e2d]
              transition-all
              duration-200
              hover:-translate-y-0.5
              shadow-sm
            "
          >
            More Products
          </button>

        </div>


        {/* ================= RIGHT PRODUCT CAROUSEL ================= */}
        <div className="relative w-full">

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

            {[0, 1].map((offset) => {

              const product =
                heroProducts[
                  (heroIndex + offset) % Math.max(heroProducts.length, 1)
                ];

              return (
                <div
                  key={`${product?._id || "empty"}-${offset}`}
                  onClick={() => {
                    if (product?._id) {
                      navigate(`/product/${product._id}`);
                    }
                  }}
                  className="
                    group
                    relative
                    min-h-[350px]
                    sm:min-h-[390px]
                    rounded-xl
                    bg-[#f3e3d0]
                    border
                    border-[#ead5bd]
                    overflow-hidden
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >

                  {/* Decorative background */}
                  <div className="
                    absolute
                    inset-0
                    pointer-events-none
                    opacity-30
                    bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.8),transparent_30%)]
                  " />

                  {/* Product Category */}
                  <div className="relative z-10 px-4 pt-4">

                    <p className="
                      text-[10px]
                      sm:text-xs
                      uppercase
                      tracking-wide
                      text-slate-500
                      font-medium
                    ">
                      {product?.category || "Categories"}
                    </p>

                    <h3 className="
                      mt-1
                      text-xl
                      sm:text-2xl
                      font-serif
                      text-[#173d3c]
                      line-clamp-1
                    ">
                      {product?.name || "Kitchen Collection"}
                    </h3>

                  </div>


                  {/* Product Image Area */}
                  <div className="
                    relative
                    h-[210px]
                    sm:h-[235px]
                    flex
                    items-center
                    justify-center
                    px-5
                  ">

                    {product?.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="
                          max-h-full
                          max-w-full
                          object-contain
                          drop-shadow-lg
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      /* Blank image area if no product image */
                      <div className="w-full h-full" />
                    )}

                  </div>


                  {/* Bottom Product Info */}
                  <div className="
                    absolute
                    left-4
                    right-4
                    bottom-4
                  ">

                    <div className="flex items-center gap-2 mb-2">

                      {product?.price && (
                        <span className="
                          text-lg
                          sm:text-xl
                          font-bold
                          text-[#123b3a]
                        ">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      )}

                      {product?.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="
                            text-xs
                            sm:text-sm
                            text-slate-500
                            line-through
                          ">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}

                    </div>


                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (product?._id) {
                          navigate(`/product/${product._id}`);
                        }
                      }}
                      className="
                        w-full
                        h-10
                        rounded-lg
                        bg-[#123b3a]
                        text-white
                        text-sm
                        font-medium
                        hover:bg-[#0c2d2c]
                        transition-colors
                      "
                    >
                      View Product
                    </button>

                  </div>

                </div>
              );
            })}

          </div>


          {/* ================= LEFT ARROW ================= */}
          <button
            onClick={prevHeroProducts}
            disabled={heroProducts.length <= HERO_VISIBLE_COUNT}
            aria-label="Previous products"
            className="
              absolute
              left-[-14px]
              sm:left-[-20px]
              top-1/2
              -translate-y-1/2
              z-20
              w-10
              h-10
              sm:w-11
              sm:h-11
              rounded-full
              bg-[#f4f1e9]
              border
              border-slate-200
              text-[#173d3c]
              flex
              items-center
              justify-center
              shadow-sm
              hover:bg-white
              hover:shadow-md
              transition-all
              duration-200
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            <ChevronLeft className="w-5 h-5" />
          </button>


          {/* ================= RIGHT ARROW ================= */}
          <button
            onClick={nextHeroProducts}
            disabled={heroProducts.length <= HERO_VISIBLE_COUNT}
            aria-label="Next products"
            className="
              absolute
              right-[-14px]
              sm:right-[-20px]
              top-1/2
              -translate-y-1/2
              z-20
              w-10
              h-10
              sm:w-11
              sm:h-11
              rounded-full
              bg-[#f4f1e9]
              border
              border-slate-200
              text-[#173d3c]
              flex
              items-center
              justify-center
              shadow-sm
              hover:bg-white
              hover:shadow-md
              transition-all
              duration-200
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>

    </div>

  </div>

</section>
      {/* ─── FEATURES BAR (Smooth Pastel Accent Boxes) ─── */}
     {/* ─── FEATURES BAR ─── */}
<section className="bg-[#fdf8f3] border-b border-amber-100/70 py-8 px-4">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">

    {/* Shipping */}
    <div
      className="sk-feature group flex items-center gap-4 p-4 rounded-2xl
      bg-white/80 border border-amber-100
      transition-all duration-300
      hover:bg-white hover:-translate-y-1
      hover:shadow-lg hover:shadow-amber-100/40"
      style={{ animationDelay: "0.05s" }}
    >
      <div
        className="p-3 rounded-xl
        bg-indigo-50 text-indigo-600
        border border-indigo-100
        transition-transform duration-300
        group-hover:scale-110"
      >
        <Truck className="w-5 h-5" />
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900">
          Pan-India Shipping
        </h4>

        <p className="text-xs text-slate-500 mt-0.5">
          Free delivery on premium items
        </p>
      </div>
    </div>


    {/* Guarantee */}
    <div
      className="sk-feature group flex items-center gap-4 p-4 rounded-2xl
      bg-white/80 border border-amber-100
      transition-all duration-300
      hover:bg-white hover:-translate-y-1
      hover:shadow-lg hover:shadow-amber-100/40"
      style={{ animationDelay: "0.15s" }}
    >
      <div
        className="p-3 rounded-xl
        bg-amber-50 text-amber-600
        border border-amber-100
        transition-transform duration-300
        group-hover:scale-110"
      >
        <ShieldCheck className="w-5 h-5" />
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900">
          Lifetime Guarantee
        </h4>

        <p className="text-xs text-slate-500 mt-0.5">
          100% food-safe certified grade
        </p>
      </div>
    </div>


    {/* Returns */}
    <div
      className="sk-feature group flex items-center gap-4 p-4 rounded-2xl
      bg-white/80 border border-amber-100
      transition-all duration-300
      hover:bg-white hover:-translate-y-1
      hover:shadow-lg hover:shadow-amber-100/40"
      style={{ animationDelay: "0.25s" }}
    >
      <div
        className="p-3 rounded-xl
        bg-purple-50 text-purple-600
        border border-purple-100
        transition-transform duration-300
        group-hover:scale-110"
      >
        <RefreshCw className="w-5 h-5" />
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900">
          Seamless Returns
        </h4>

        <p className="text-xs text-slate-500 mt-0.5">
          Hassle-free 7-day exchange window
        </p>
      </div>
    </div>

  </div>
</section>


{/* ─── MAIN STOREFRONT ─── */}
<main
  id="shop"
  className="flex-1 w-full bg-gradient-to-b from-[#fdf8f3] via-white to-slate-50/60"
>
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-16">

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

      {/* ================= FILTER SIDEBAR ================= */}
      <aside
        className="
          space-y-6
          lg:sticky lg:top-24
          bg-white/90
          backdrop-blur-sm
          border border-amber-100
          rounded-2xl
          p-6
          shadow-sm
          transition-all duration-300
          hover:shadow-lg
          hover:shadow-amber-100/40
        "
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-4">

          <h3
            className="
              text-sm
              font-bold
              uppercase
              tracking-wider
              text-slate-900
              flex
              items-center
              gap-2
            "
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />

            Filter Options
          </h3>

          {(searchInput || maxPriceInput || selectedCategory || sort) && (
            <button
              onClick={clearAllFilters}
              className="
                text-xs
                font-semibold
                text-indigo-600
                hover:text-purple-600
                transition-colors
              "
            >
              Clear All
            </button>
          )}

        </div>


        {/* Search */}
        <div className="space-y-1.5">

          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Search Catalog
          </label>

          <div className="relative">

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Type keywords..."
              className="
                w-full
                bg-[#fdf8f3]
                border border-amber-100
                rounded-xl
                py-2.5
                pl-9
                pr-4
                text-xs
                text-slate-800
                placeholder-slate-400
                focus:outline-none
                focus:border-indigo-400
                focus:bg-white
                focus:ring-2
                focus:ring-indigo-100
                transition
              "
            />

            <Search
              className="
                w-4 h-4
                text-slate-400
                absolute
                left-3
                top-1/2
                -translate-y-1/2
              "
            />

          </div>
        </div>


        {/* Sorting */}
        <div className="space-y-1.5">

          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Sort Products
          </label>

          <div className="relative">

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="
                w-full
                appearance-none
                bg-[#fdf8f3]
                border border-amber-100
                rounded-xl
                p-2.5
                pr-10
                text-xs
                text-slate-700
                focus:outline-none
                focus:border-indigo-400
                focus:bg-white
                focus:ring-2
                focus:ring-indigo-100
                transition
                cursor-pointer
              "
            >
              <option value="">Relevance</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>

            <Sliders
              className="
                w-3.5 h-3.5
                text-slate-400
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                pointer-events-none
              "
            />

          </div>
        </div>


        {/* Price */}
        <div className="space-y-1.5">

          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Max Budget Limit
          </label>

          <div className="relative">

            <span
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-amber-500
                font-bold
                text-xs
              "
            >
              ₹
            </span>

            <input
              type="number"
              placeholder="Enter dynamic ceiling price..."
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="
                w-full
                bg-[#fdf8f3]
                border border-amber-100
                rounded-xl
                py-2.5
                pl-7
                pr-4
                text-xs
                text-slate-800
                placeholder-slate-400
                focus:outline-none
                focus:border-indigo-400
                focus:bg-white
                focus:ring-2
                focus:ring-indigo-100
                transition
              "
            />

          </div>
        </div>


        {/* Categories */}
        <div className="space-y-2">

          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Product Category
          </label>

          <div className="flex flex-col gap-1.5">

            {categories.map((category) => {

              const isActive =
                selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(category.id)
                  }
                  className={`
                    text-left
                    px-3
                    py-2.5
                    text-xs
                    rounded-xl
                    
                    border
                    transition-all
                    duration-200
                    flex
                    items-center
                    justify-between

                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-indigo-50
                          to-purple-50
                          border-indigo-200
                          text-indigo-700
                          font-semibold
                          shadow-sm
                        `
                        : `
                          bg-[#fdf8f3]
                          border-amber-100
                          text-slate-600
                          hover:bg-white
                          hover:text-bg-[#123b3a]
                          hover:border-indigo-100
                          hover:translate-x-0.5
                        `
                    }
                  `}
                >
                  <span>{category.name}</span>

                  {isActive && (
                    <div
                      className="
                        w-1.5
                        h-1.5
                        rounded-full
                        bg-gradient-to-r
                        from-indigo-600
                        to-purple-600
                      "
                    />
                  )}

                </button>
              );
            })}

          </div>
        </div>

      </aside>


      {/* ================= PRODUCTS ================= */}
      <div className="lg:col-span-3 space-y-8">

        {loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {[...Array(6)].map((_, idx) => (

              <div
                key={idx}
                className="
                  bg-white
                  rounded-2xl
                  
                  border border-amber-100
                  p-4
                  space-y-4
                  shadow-sm
                "
              >
                <div className="sk-skeleton h-48 w-full rounded-xl" />

                <div className="space-y-2">
                  <div className="sk-skeleton h-4 rounded w-3/4" />
                  <div className="sk-skeleton h-3 rounded w-1/2" />
                </div>
              </div>

            ))}

          </div>

        ) : products.length === 0 ? (

          <div
            className="
              text-center
              bg-[#123b3a]
              py-24
              bg-white
              border border-amber-100
              rounded-2xl
              p-8
              max-w-md
              mx-auto
              shadow-sm
            "
          >
            <ShoppingBag className="w-10 h-10 text-amber-300 mx-auto mb-3" />

            <h3 className="text-base font-bold text-slate-800">
              No products found
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              We couldn't track down matching results.
              Try clearing some search parameters.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {products.map((product, idx) => (

              <div
                key={product._id}
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
                className="
                  sk-card
                  group
                  bg-white
                  rounded-2xl
                  border border-amber-100
                  overflow-hidden
                  transition-all
                  duration-300
                  flex
                  flex-col
                  cursor-pointer
                  hover:border-indigo-200
                  hover:shadow-xl
                  hover:shadow-indigo-100/40
                  hover:-translate-y-1
                "
                style={{
                  animationDelay: `${Math.min(idx, 8) * 0.06}s`
                }}
              >

                {/* Product Image */}
                <div
                  className="
                    relative
                    aspect-square
                    bg-gradient-to-br
                    from-[#fdf8f3]
                    via-[#fffaf5]
                    to-indigo-50/30
                    p-6
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    border-b
                    border-amber-100
                  "
                >

                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                        max-h-full
                        max-w-full
                        object-contain
                        mix-blend-multiply
                        group-hover:scale-[1.06]
                        transition-transform
                        duration-500
                        ease-out
                      "
                    />
                  )}

                  {/* Rating */}
                  <div
                    className="
                      absolute
                      top-3
                      right-3
                      flex
                      items-center
                      gap-1
                      bg-white/90
                      backdrop-blur-sm
                      border border-amber-100
                      px-2
                      py-0.5
                      rounded-lg
                      text-[10px]
                      text-amber-600
                      font-bold
                      shadow-sm
                    "
                  >
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    4.8
                  </div>

                </div>


                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

                  <div>

                    <h2
                      className="
                        font-bold
                        text-slate-800
                        text-sm
                        md:text-base
                        line-clamp-1
                        group-hover:text-[#123b3a]
                        transition
                      "
                    >
                      {product.name}
                    </h2>

                    <span
                      className="
                        inline-block
                        text-[10px]
                        font-bold
                        text-slate-400
                        uppercase
                        tracking-widest
                        mt-0.5
                      "
                    >
                      {product.capacity || "Standard Capacity Size"}
                    </span>

                  </div>


                  {/* Price */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      pt-3
                      border-t
                      border-amber-100
                    "
                  >

                    <div className="flex items-baseline space-x-1.5">

                      <span
                        className="
                            text-[#123b3a]
                          text-lg
                          font-bold
                          tracking-tight
                        "
                      >
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      {product.originalPrice &&
                        product.originalPrice > product.price && (

                          <span
                            className="
                              text-[#123b3a]
                             
                              text-xs
                              line-through
                            "
                          >
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </span>

                        )}

                    </div>

                    <div
                      className="
                        p-2.5
                        rounded-xl
                        
                        bg-indigo-50
                        text-indigo-600
                        group-hover:bg-[#123b3a]
                        group-hover:text-white
                        transition-all
                        duration-200
                        border border-indigo-100
                        group-hover:border-green-600
                        shadow-sm
                        group-hover:scale-110
                      "
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* Pagination */}
        {products.length > 0 && (

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              pt-6
              border-t
              border-amber-100
              w-full
            "
          >

            <button
              disabled={page === 1}
              onClick={() =>
                setPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
              className="
                flex
                items-center
                gap-1
                px-4
                py-2
                text-xs
                font-semibold
                border border-amber-100
                rounded-xl
                bg-white
                text-slate-600
                hover:text-indigo-700
                hover:border-indigo-200
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>


            <span
              key={page}
              className="
                text-xs
                font-bold
                text-slate-400
                tracking-wide
                uppercase
              "
            >
              Page {page} / {totalPages}
            </span>


            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              className="
                flex
                items-center
                gap-1
                px-4
                py-2
                text-xs
                font-semibold
                border border-amber-100
                rounded-xl
                bg-white
                text-slate-600
                hover:text-indigo-700
                hover:border-indigo-200
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>

        )}

      </div>

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

              <li><button onClick={() => setSelectedCategory("Storage Containers")} className="hover:text-slate-300 hover:translate-x-0.5  transition inline-block">Storage Containers</button></li>

              <li><button onClick={() => setSelectedCategory("Water Bottles")} className="hover:text-slate-300 hover:translate-x-0.5 transition inline-block">Water Bottles</button></li>

              <li><button onClick={() => setSelectedCategory("")} className="hover:text-slate-300 hover:translate-x-0.5 transition inline-block">All Product Vaults</button></li>

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
    </>
  );
}
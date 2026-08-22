import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import Navbar from "../components/Navbar";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const [totalPages, setTotalPages] = useState(1);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await getProducts(
          keyword,
          category,
          sort,
          maxPrice,
          page
        );

        if (data.success) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        console.error("Products fetch error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, sort, maxPrice, page]);

  // Update URL
  useEffect(() => {
    const params = {};

    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (maxPrice) params.maxPrice = maxPrice;
    if (page > 1) params.page = page;

    setSearchParams(params);
  }, [
    keyword,
    category,
    sort,
    maxPrice,
    page,
    setSearchParams,
  ]);

  // Search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setKeyword("");
    setCategory("");
    setSort("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
   <Navbar/>
      {/* ================= HEADER ================= */}

     <section
  className="relative overflow-hidden border-b bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/hero1.png')",
  }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/45"></div>

  {/* Shiny animated light */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 -left-[150%] h-full w-[80%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] animate-shine"></div>
  </div>

  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
    
    <p className="text-white/80 uppercase tracking-[0.3em] text-sm mb-3">
      Explore Our Collection
    </p>

    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
      All Products
    </h1>

    <p className="text-white/85 mt-4 text-base md:text-lg max-w-2xl mx-auto">
      Discover our collection of quality products crafted to add style,
      comfort and value to your everyday life.
    </p>

  </div>
</section>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ================= SEARCH ================= */}

        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col md:flex-row gap-3"
        >

          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800"
          >
            Search
          </button>

        </form>

        {/* ================= FILTERS ================= */}

        <div className="bg-white rounded-2xl border p-5 mb-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Category */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border rounded-xl outline-none"
              >
                <option value="">
                  All Categories
                </option>

                <option value="Kitchen">
                  Kitchen
                </option>

                <option value="Storage">
                  Storage
                </option>

                <option value="Accessories">
                  Accessories
                </option>

                <option value="Jewellery">
                  Jewellery
                </option>

              </select>
            </div>

            {/* Price */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Price
              </label>

              <input
                type="number"
                placeholder="₹ Maximum"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border rounded-xl outline-none"
              />
            </div>

            {/* Sort */}

            <div>
              <label className="block text-sm font-medium mb-2">
                Sort By
              </label>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border rounded-xl outline-none"
              >
                <option value="">
                  Default
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>

              </select>
            </div>

            {/* Clear */}

            <div className="flex items-end">

              <button
                onClick={clearFilters}
                className="w-full py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-100"
              >
                Clear Filters
              </button>

            </div>

          </div>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-gray-200" />

                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}

          </div>
        ) : products.length === 0 ? (

          /* ================= EMPTY ================= */

          <div className="bg-white rounded-2xl p-16 text-center">

            <div className="text-5xl mb-4">
              🛍️
            </div>

            <h2 className="text-2xl font-bold">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 px-6 py-3 bg-black text-white rounded-xl"
            >
              View All Products
            </button>

          </div>

        ) : (

          /* ================= PRODUCTS ================= */

          <>

            <div className="flex justify-between items-center mb-5">

              <p className="text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>{" "}
                products
              </p>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

              {products.map((product) => (

                <ProductCard
                  key={product._id}
                  product={product}
                />

              ))}

            </div>

          </>

        )}

        {/* ================= PAGINATION ================= */}

        {!loading && totalPages > 1 && (

          <div className="flex justify-center items-center gap-2 mt-10">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              className="px-4 py-2 border rounded-lg disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (

              <button
                key={pageNumber}
                onClick={() =>
                  setPage(pageNumber)
                }
                className={`w-10 h-10 rounded-lg ${
                  page === pageNumber
                    ? "bg-black text-white"
                    : "border bg-white"
                }`}
              >
                {pageNumber}
              </button>

            ))}

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className="px-4 py-2 border rounded-lg disabled:opacity-40"
            >
              Next
            </button>

          </div>

        )}

      </div>
    </div>
  );
};


/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = ({ product }) => {

  const discount =
    product.originalPrice &&
    Number(product.originalPrice) >
      Number(product.price)
      ? Math.round(
          ((Number(product.originalPrice) -
            Number(product.price)) /
            Number(product.originalPrice)) *
            100
        )
      : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300">

      {/* Image */}

      <Link
        to={`/product/${product._id}`}
        className="block relative overflow-hidden"
      >

        <div className="aspect-square bg-gray-100">

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

        </div>

        {/* Discount */}

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {discount}% OFF
          </span>
        )}

        {/* Out of stock */}

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">

            <span className="bg-white text-black px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>

          </div>
        )}

      </Link>

      {/* Details */}

      <div className="p-4">

        {product.category && (
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {product.category}
          </p>
        )}

        <Link to={`/product/${product._id}`}>

          <h2 className="font-semibold text-gray-900 line-clamp-2 hover:text-gray-600">
            {product.name}
          </h2>

        </Link>

        <div className="flex items-center gap-2 mt-3">

          <span className="text-lg font-bold">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹
              {Number(
                product.originalPrice
              ).toLocaleString("en-IN")}
            </span>
          )}

        </div>

        <Link
          to={`/product/${product._id}`}
          className="block text-center mt-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800"
        >
          View Product
        </Link>

      </div>

    </div>
  );
};

export default Products;
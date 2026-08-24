import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";

import API from "../services/api";
import { addToCart, getCart } from "../services/cartService";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState(0);

  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  // --------------------------------------------------
  // Fetch product
  // --------------------------------------------------

  useEffect(() => {
    setLoading(true);

    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.product);
        setSelectedImage(0);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load product details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // --------------------------------------------------
  // Product Images
  // --------------------------------------------------

  const productImages = useMemo(() => {
    if (!product) return [];

    // New multiple-image products
    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images;
    }

    // Old products with single image
    if (product.image) {
      return [product.image];
    }

    return [];
  }, [product]);

  // --------------------------------------------------
  // Previous Image
  // --------------------------------------------------

  const handlePreviousImage = () => {
    if (productImages.length <= 1) return;

    setSelectedImage((current) =>
      current === 0
        ? productImages.length - 1
        : current - 1
    );

    setIsZoomed(false);
  };

  // --------------------------------------------------
  // Next Image
  // --------------------------------------------------

  const handleNextImage = () => {
    if (productImages.length <= 1) return;

    setSelectedImage((current) =>
      current === productImages.length - 1
        ? 0
        : current + 1
    );

    setIsZoomed(false);
  };

  // --------------------------------------------------
  // Mouse Zoom
  // --------------------------------------------------

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width) * 100;

    const y =
      ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x,
      y,
    });
  };

  // --------------------------------------------------
  // Add To Cart
  // --------------------------------------------------

  const handleAddToCart = async () => {
    try {
      const res = await getCart();

      const currentItems =
        res.data?.cart?.items || [];

      const isAlreadyInCart =
        currentItems.some(
          (item) =>
            item.product?._id === product._id
        );

      if (isAlreadyInCart) {
        toast.error(
          "Product is already in your cart! 🛒"
        );
        return;
      }

      await addToCart(product._id, 1);

      toast.success(
        "Product Added To Cart ✅"
      );

      window.dispatchEvent(
        new Event("cart-updated")
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Please login first"
      );

      navigate("/login");
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4" />

        <p className="text-xs text-slate-400 tracking-wide font-medium">
          Loading Product...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // Product Not Found
  // --------------------------------------------------

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">
            Item Not Found
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            The requested product could not be located.
          </p>

          <Link
            to="/"
            className="inline-flex justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-xl border border-slate-800 transition duration-200"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Discount
  // --------------------------------------------------

  const discountPercent =
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

  // --------------------------------------------------
  // Current Image
  // --------------------------------------------------

  const currentImage =
    productImages[selectedImage] ||
    product.image;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 relative overflow-x-hidden">

      {/* ----------------------------------------- */}
      {/* Ambient Background */}
      {/* ----------------------------------------- */}

      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ----------------------------------------- */}
        {/* Back */}
        {/* ----------------------------------------- */}

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white mb-8 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />

          Back to Catalogue
        </Link>

        {/* ----------------------------------------- */}
        {/* Product Layout */}
        {/* ----------------------------------------- */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* ======================================= */}
          {/* IMAGE GALLERY */}
          {/* ======================================= */}

          <div className="w-full">

            {/* Main Image */}
            <div
              className="relative rounded-2xl bg-slate-900/30 backdrop-blur-md border border-slate-800/50 overflow-hidden shadow-2xl aspect-square cursor-zoom-in"
              onMouseEnter={() =>
                setIsZoomed(true)
              }
              onMouseLeave={() =>
                setIsZoomed(false)
              }
              onMouseMove={handleMouseMove}
            >

              {/* Image */}
              {currentImage && (
                <img
                  src={currentImage}
                  alt={product.name}
                  className={`w-full h-full object-contain p-6 transition-transform duration-200 ${
                    isZoomed
                      ? "scale-[2.2]"
                      : "scale-100"
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }
                      : undefined
                  }
                />
              )}

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent pointer-events-none" />

              {/* Discount */}
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider z-20">
                  Save {discountPercent}%
                </span>
              )}

              {/* Zoom Icon */}
              {productImages.length > 0 && (
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md rounded-full p-2.5 text-white pointer-events-none">
                  <ZoomIn className="w-5 h-5" />
                </div>
              )}

              {/* Previous */}
              {productImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviousImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white transition z-20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Next */}
              {productImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white transition z-20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Image Counter */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white">
                  {selectedImage + 1} /{" "}
                  {productImages.length}
                </div>
              )}
            </div>

            {/* =================================== */}
            {/* THUMBNAILS */}
            {/* =================================== */}

            {productImages.length > 1 && (
              <div className="mt-4">

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">

                  {productImages.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => {
                          setSelectedImage(index);
                          setIsZoomed(false);
                        }}
                        className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          selectedImage === index
                            ? "border-indigo-500 ring-2 ring-indigo-500/30 scale-[1.03]"
                            : "border-slate-800 hover:border-slate-600"
                        }`}
                      >

                        <img
                          src={image}
                          alt={`${product.name} ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover"
                        />

                        {selectedImage ===
                          index && (
                          <div className="absolute inset-0 bg-indigo-500/10" />
                        )}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

          {/* ======================================= */}
          {/* PRODUCT INFORMATION */}
          {/* ======================================= */}

          <div className="space-y-6">

            {/* Collection */}
            <div className="space-y-2">

              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                <Sparkles className="w-3 h-3" />

                Premium Collection
              </span>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {product.name}
              </h1>

            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light">
              {product.description ||
                "No product description available."}
            </p>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-3 pt-2">

              <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                  Size
                </span>

                <span className="text-sm font-semibold text-slate-200">
                  {product.size ||
                    product.capacity ||
                    "Standard"}
                </span>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                  Material
                </span>

                <span className="text-sm font-semibold text-slate-200">
                  {product.material ||
                    "Certified Grade"}
                </span>
              </div>

            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 pt-4 border-t border-slate-900">

              <span className="text-3xl md:text-4xl font-black text-emerald-400 tracking-tight">
                ₹{product.price}
              </span>

              {product.originalPrice && (
                <span className="text-lg text-slate-500 line-through font-medium">
                  ₹{product.originalPrice}
                </span>
              )}

              {discountPercent > 0 && (
                <span className="text-sm font-bold text-emerald-400">
                  {discountPercent}% OFF
                </span>
              )}

            </div>

            {/* Stock */}
            {product.stock !== undefined && (
              <div>
                {product.stock > 0 ? (
                  <span className="text-sm text-emerald-400 font-medium">
                    ✓ {product.stock} items available
                  </span>
                ) : (
                  <span className="text-sm text-red-400 font-medium">
                    Out of stock
                  </span>
                )}
              </div>
            )}

            {/* Add To Cart */}
            <div className="pt-4 space-y-4">

              <button
                onClick={handleAddToCart}
                disabled={
                  product.stock !== undefined &&
                  product.stock <= 0
                }
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-3 group"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />

                <span>
                  {product.stock !== undefined &&
                  product.stock <= 0
                    ? "Out of Stock"
                    : "Add To Cart"}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500/80" />

                <span>
                  Quality Tested Kitchenware Guarantee
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
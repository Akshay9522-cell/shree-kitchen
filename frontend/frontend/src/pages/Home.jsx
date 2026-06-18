import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");

      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <h1 className="text-4xl font-bold text-center mb-8">
    Shree Kitchen
  </h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {products.map((product) => (
      <div
        key={product._id}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-60 w-full object-cover"
        />

        <div className="p-4">
          <h2 className="font-bold text-lg">
            {product.name}
          </h2>

          <p className="text-gray-600 text-sm">
            {product.capacity}
          </p>

          <div className="mt-2">
            <span className="text-green-600 text-xl font-bold">
              ₹{product.price}
            </span>

            <span className="ml-2 text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          </div>

          <button
  onClick={() => navigate(`/product/${product._id}`)}
  className="w-full mt-4 bg-black text-white py-2 rounded-lg"
>
  View Product
</button>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}
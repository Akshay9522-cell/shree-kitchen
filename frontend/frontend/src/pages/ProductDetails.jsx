import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import API from "../services/api";
import { addToCart } from "../services/cartService";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.product);
      })
      .catch(console.error);
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }
  const handleAddToCart = async () => {
  try {

    await addToCart(product._id, 1);

    alert("Product Added To Cart ✅");

  } catch (error) {

    console.log(error);

    alert("Please login first");

  }
};

  return (
    <div className="max-w-6xl mx-auto p-8">

  <div className="grid md:grid-cols-2 gap-10">

    <img
      src={product.image}
      alt={product.name}
      className="rounded-xl shadow-lg w-full"
    />

    <div>

      <h1 className="text-4xl font-bold">
        {product.name}
      </h1>

      <p className="mt-4 text-gray-600">
        {product.description}
      </p>

      <p className="mt-2">
        Capacity: {product.capacity}
      </p>

      <p className="mt-2">
        Material: {product.material}
      </p>

      <div className="mt-4">

        <span className="text-green-600 text-3xl font-bold">
          ₹{product.price}
        </span>

        <span className="ml-3 text-gray-400 line-through">
          ₹{product.originalPrice}
        </span>

      </div>
<button
  onClick={handleAddToCart}
  className="mt-6 bg-black text-white px-8 py-3 rounded-lg"
>
  Add To Cart
</button>

    </div>

  </div>

</div>
  );
}
import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import API from "../services/api";

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

  return (
    <div>
      <h2>{product.name}</h2>

      <p>{product.description}</p>

      <h3>₹{product.price}</h3>
    </div>
  );
}
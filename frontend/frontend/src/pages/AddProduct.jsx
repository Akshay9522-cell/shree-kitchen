import { useState } from "react";
import { createProduct } from "../services/adminProductService";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      stock: "",
      capacity: "",
      material: "",
    });

  const [image, setImage] =
    useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data =
        new FormData();

      Object.keys(formData).forEach(
        (key) => {
          data.append(
            key,
            formData[key]
          );
        }
      );

      data.append(
        "image",
        image
      );

      await createProduct(data);

      alert(
        "Product Added Successfully"
      );

      navigate(
        "/admin/products"
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >

        <input
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="originalPrice"
          placeholder="Original Price"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="stock"
          placeholder="Stock"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="capacity"
          placeholder="Capacity"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="material"
          placeholder="Material"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="file"
          onChange={(e) =>
            setImage(
              e.target.files[0]
            )
          }
          className="w-full"
        />

        <button
          className="w-full bg-black text-white py-3 rounded"
        >
          Add Product
        </button>

      </form>

    </div>
  );
}
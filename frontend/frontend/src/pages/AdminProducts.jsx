import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  getAllProducts,
  deleteProduct,
} from "../services/adminProductService";

export default function AdminProducts() {
const navigate = useNavigate();
  const [products, setProducts] =
    useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {

    const res =
      await getAllProducts();

    setProducts(
      res.data.products
    );
  };

  const handleDelete = async (
    id
  ) => {

    if (
      !window.confirm(
        "Delete Product?"
      )
    )
      return;

    await deleteProduct(id);

    loadProducts();
  };

  return (
    <div className="p-8">

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Manage Products
        </h1>

      </div>

      <table className="w-full border">

        <thead>

          <tr className="bg-gray-100">

            <th>Name</th>
            <th>Price</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {products.map((p) => (

            <tr
              key={p._id}
              className="border"
            >

              <td>{p.name}</td>

              <td>
                ₹{p.price}
              </td>

              <td>

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() =>
                    handleDelete(
                      p._id
                    )
                  }
                >
                  Delete
                </button>
                <Link
  to="/admin/add-product"
  className="bg-black text-white px-4 py-2 rounded"
>
  Add Product
</Link>

              </td>
              <td>
                <button
  onClick={() =>
    navigate(
      `/admin/edit-product/${p._id}`
    )
  }
  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
>
  Edit
</button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
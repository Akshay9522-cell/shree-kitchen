import { useEffect, useState } from "react";
import { getLowStockProducts } from "../services/adminService";

export default function LowStockAlert() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res =
        await getLowStockProducts();

      setProducts(
        res.data.products
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Low Stock Alerts
      </h2>

      {products.length === 0 ? (
        <p className="text-green-600 font-medium">
          All products are well stocked ✅
        </p>
      ) : (
        <div className="space-y-3">

          {products.map((product) => (
            <div
              key={product._id}
              className="flex justify-between border-b pb-2"
            >
              <span>
                {product.name}
              </span>

              <span className="text-red-500 font-bold">
                {product.stock} left
              </span>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
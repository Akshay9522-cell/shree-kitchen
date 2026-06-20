import {
  useEffect,
  useState,
} from "react";

import {
  getTopProducts,
} from "../services/adminService";

export default function TopProducts() {

  const [products, setProducts] =
    useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {

      const res =
        await getTopProducts();

      setProducts(
        res.data.topProducts
      );
    };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Top Selling Products
      </h2>

      <div className="space-y-4">

        {products.map(
          (item) => (
            <div
              key={item._id}
              className="flex justify-between border-b pb-3"
            >
              <div>

                <h3 className="font-semibold">
                  {
                    item.product.name
                  }
                </h3>

                <p className="text-sm text-gray-500">
                  Sold:
                  {" "}
                  {
                    item.totalSold
                  }
                </p>

              </div>

              <span className="font-bold text-green-600">
                #{products.indexOf(item) + 1}
              </span>

            </div>
          )
        )}

      </div>

    </div>
  );
}
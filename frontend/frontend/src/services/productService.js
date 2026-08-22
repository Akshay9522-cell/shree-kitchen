import API from "./api";

// Get all products
export const getProducts = (
  keyword = "",
  category = "",
  sort = "",
  maxPrice = "",
  page = 1
) => {
  return API.get("/products", {
    params: {
      keyword: keyword || undefined,
      category: category || undefined,
      sort: sort || undefined,
      maxPrice: maxPrice || undefined,
      page,
    },
  });
};

// Get single product
export const getProductById = (id) => {
  return API.get(`/products/${id}`);
};

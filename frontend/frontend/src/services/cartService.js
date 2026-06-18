import API from "./api";

export const addToCart = async (
  productId,
  quantity = 1
) => {
  return API.post("/cart", {
    productId,
    quantity,
  });
};

export const getCart = () => API.get("/cart");

export const updateCartItem = (
  productId,
  quantity
) =>
  API.put(`/cart/${productId}`, {
    quantity,
  });

export const removeCartItem = (
  productId
) =>
  API.delete(`/cart/${productId}`);
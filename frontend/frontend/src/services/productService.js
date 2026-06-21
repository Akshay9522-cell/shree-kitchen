import API from "./api";

export const getProducts =
  (keyword = "") =>
    API.get(
      `/products?keyword=${keyword}`
    );
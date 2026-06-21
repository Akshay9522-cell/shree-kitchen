import API from "./api";

export const getProducts = (
  keyword = "",
  category = "",
  sort = "",
  maxPrice = "",
  page = 1
) =>
  API.get(
    `/products?keyword=${keyword}&category=${category}&sort=${sort}&maxPrice=${maxPrice}&page=${page}`
  );
// src/services/adminProductService.js

import API from "./api";

export const getAllProducts = () =>
  API.get("/products");

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);

export const updateProduct = (
  id,
  data
) =>
  API.put(`/products/${id}`, data);

export const createProduct = (
  formData
) =>
  API.post(
    "/products",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
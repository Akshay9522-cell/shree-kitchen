// services/adminService.js

import API from "./api";

export const getAllOrders = () =>
  API.get("/orders");

export const updateOrderStatus = (
  id,
  orderStatus
) =>
  API.put(
    `/orders/${id}/status`,
    { orderStatus }
  );

  export const getDashboardStats =
  () =>
    API.get(
      "/admin/dashboard"
    );
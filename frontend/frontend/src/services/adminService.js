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

    export const getSalesAnalytics = 
    () =>
     API.get("/admin/analytics");

    export const getRecentOrders =
  () =>
    API.get(
      "/admin/recent-orders"
    );
    export const getTopProducts =
  () =>
    API.get(
      "/admin/top-products"
    );

    
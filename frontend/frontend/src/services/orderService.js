import API from "./api";

export const placeOrder = (data) =>
  API.post("/orders", data);

export const getMyOrders = () =>
  API.get("/orders/my-orders");
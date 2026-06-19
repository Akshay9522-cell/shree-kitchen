import API from "./api";

export const createPaymentOrder = (
  orderId
) =>
  API.post(
    "/payments/create-order",
    { orderId }
  );

export const verifyPayment = (
  data
) =>
  API.post(
    "/payments/verify",
    data
  );
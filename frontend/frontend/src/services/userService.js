import API from "./api";

export const getDashboardStats =
  () =>
    API.get(
      "/user/dashboard"
    );

export const getProfile =
  () =>
    API.get(
      "/user/profile"
    );

export const updateProfile =
  (data) =>
    API.put(
      "/user/profile",
      data
    );

export const changePassword =
  (data) =>
    API.put(
      "/user/change-password",
      data
    );    
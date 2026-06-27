import axios from "axios";

const API = axios.create({
  baseURL: "https://pvc-inventory.onrender.com",
});

// const API = axios.create({
//   baseURL: "http://localhost:5000",
// });

API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getDashboardStats = () =>
  API.get("/dashboard");

export const addProduct = (data) =>
  API.post("/products", data);

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);

export const getHistory = () =>
  API.get("/inventory/history");

export const getProducts = (search = "") =>
  API.get(`/products?search=${search}`);

export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data);

export const getActivityHistory = () =>
  API.get("/inventory/activity-history");

export const stockIn = (data) =>
  API.post("/inventory/in", data);

export const stockOut = (data) =>
  API.post("/inventory/out", data);

export const getTransactionHistory = () =>
  API.get("/inventory/history");

export const getReportData = (filters) =>
  API.get("/reports", {
    params: filters,
  });

  export const downloadReportPDF = (filters) =>
  API.get("/reports/pdf", {
    params: filters,
    responseType: "blob",
  });

  export const downloadReportExcel = (filters) =>
  API.get("/reports/excel", {
    params: filters,
    responseType: "blob",
  });

  export const login = (data) =>
  API.post("/auth/login", data);


// user creation, deletion and reading 

  export const getUsers = () => {
  return API.get("/users");
};

export const createUser = (userData) => {
  return API.post("/users", userData);
};

export const deleteUser = (id) => {
  return API.delete(`/users/${id}`);
};

export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", {
    email,
  });

export const resetPassword = (
  token,
  password
) =>
  API.post(
    `/auth/reset-password/${token}`,
    {
      password,
    }
  );

  export const downloadActivityExcel = () =>
  API.get(
    "/inventory/activity-history/excel",
    {
      responseType: "blob",
    }
  );

 export const updateUsername = (
  id,
  username
) =>
  API.put(
    `/users/${id}/username`,
    { username }
  );

  export const updateUserPassword = (id, password) =>
  API.put(`/users/${id}/password`, {
    password,
  });

export const updateUserEmail = (id, email) =>
  API.put(`/users/${id}/email`, {
    email,
  });



  
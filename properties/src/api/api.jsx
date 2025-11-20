import axios from "axios";

// Public endpoints that do not require token
const PUBLIC_ENDPOINTS = [
const PUBLIC_ENDPOINTS = new Set([
  "/login/login",
  "/login/register",
  "/login/login",
  "/login/register",
];
  // Free access endpoints for projects/profiles
  "/free-acess/",
]);

const API = axios.create({
export const BaseUrl = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json", // Ensure JSON payload
  },
});

// Add token for protected endpoints
API.interceptors.request.use((config) => {
  if (!PUBLIC_ENDPOINTS.some((ep) => config.url.includes(ep))) {
BaseUrl.interceptors.request.use((config) => {
  if (![...PUBLIC_ENDPOINTS].some((ep) => config.url.startsWith(ep))) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 Unauthorized globally
// API.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login/user"; // Redirect to login
//     }
//     return Promise.reject(error);
//   }
// );
// Optional: Handle 401 Unauthorized globally
BaseUrl.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // To prevent redirect loops, you might want to check if already on login page
      if (window.location.pathname !== "/login/user") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login/user"; // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

// -------- User Endpoints --------
export const registerUser = (data) => API.post("/login/register", data);
export const loginUser = (data) => API.post("/login/login", data);
export const getUserProfile = () => API.get("/login/me");
export const registerUser = (data) => BaseUrl.post("/login/register", data);
export const loginUser = (data) => BaseUrl.post("/login/login", data);
export const getUserProfile = () => BaseUrl.get("/login/me");

// -------- Admin Endpoints --------
export const registerAdmin = (data) => API.post("/login/register", data);
export const loginAdmin = (data) => API.post("/login/login", data);
export const getAdminDashboard = () => API.get("/login/dashboard");
export const registerAdmin = (data) => BaseUrl.post("/login/register", data);
export const loginAdmin = (data) => BaseUrl.post("/login/login", data);
export const getAdminDashboard = () => BaseUrl.get("/login/dashboard");

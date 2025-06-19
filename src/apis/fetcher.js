import axios from "axios";

export const fetcher = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Giữ nguyên để hỗ trợ cookie
});

fetcher.interceptors.request.use((config) => {
  const publicEndpoints = ["/accounts/login", "/accounts/register/user"];
  const currentUserStr = localStorage.getItem("currentUser");
  let currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  if (currentUser && !publicEndpoints.some((endpoint) => config.url.includes(endpoint))) {
    const accessToken = currentUser.token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

fetcher.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
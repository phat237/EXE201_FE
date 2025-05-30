import axios from "axios";

export const fetcher = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

fetcher.interceptors.request.use((config) => {
  const publicEndpoints = ["/accounts/login", "/accounts/register/user"];
  const currentUserStr = localStorage.getItem("currentUser");
  let currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;



  if (currentUser && !publicEndpoints.some((endpoint) => config.url.includes(endpoint))) {
    const accessToken = currentUser.token || currentUser.accessToken; // Thử cả hai trường hợp
    if (!accessToken) {
      console.warn("No accessToken found in currentUser:", currentUser);
    }
    config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : "Bearer no-token";
  
  } else {
   console.log("CurrentUser from localStorage:", currentUser);
  }

  return config;
});

fetcher.interceptors.response.use(
  (response) => {
    console.log("API response:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
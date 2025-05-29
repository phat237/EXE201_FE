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
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (
    currentUser &&
    !publicEndpoints.some((endpoint) => config.url.includes(endpoint))
  ) {
    config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
  }

  return config;
});

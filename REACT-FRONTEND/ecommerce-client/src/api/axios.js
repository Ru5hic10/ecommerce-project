import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // change if deployed
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

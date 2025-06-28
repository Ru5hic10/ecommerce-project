// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // 🔁 Update this when you deploy
  withCredentials: true,                // 👈 In case you use cookies (optional)
});

// 🔐 Attach JWT token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("jwtToken"); // Match this key with your login storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;

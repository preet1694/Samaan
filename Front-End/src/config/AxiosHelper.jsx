import axios from "axios";

export const baseURL = "http://localhost:8080/api"; // Change if needed

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

import axios from "axios";

export const baseURL = "https://samaan-pooling.onrender.com/api"; // Change if needed

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

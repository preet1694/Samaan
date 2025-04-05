import axios from "axios";

// export const baseURL = "https://samaan-pooling.onrender.com/api"; // Change if needed
export const baseURL = "http://localhost:8080/api"; // To run on localhost
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
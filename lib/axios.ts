import axios from "axios";

export const api = axios.create({
  baseURL: process.env.BASE_URL || "http://localhost:8080/api",
  withCredentials: true, // VERY IMPORTANT for JSESSIONID
});

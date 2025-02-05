import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants.js";
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;
      
      console.log("Token in Redux:", token); // ✅ Debugging Log
  
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.warn("🚨 Token is missing in Redux!");
      }
  
      return headers;
    },
    credentials: "include",
  });
  

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Products", "Orders", "Users", "Categories", "Carts"],
  endpoints: () => ({}),
});

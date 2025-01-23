import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants.js";

//This is base query for all api routes
const baseQuery = fetchBaseQuery({
     baseUrl : BASE_URL
});
//Export api slices 
export const apiSlice = createApi({
    baseQuery,
    tagTypes : [ 'Product', 'Order', 'User', 'Category'],
    endpoints : () => ({})
});
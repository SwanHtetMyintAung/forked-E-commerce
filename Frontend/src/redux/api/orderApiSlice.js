import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "../constants.js";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchOrders: builder.query({
      query: ({ page, pageSize, status, searchTerm }) => {
        let url = `${ORDER_URL}/all?page=${page}&pageSize=${pageSize}`;
        
        if (status && status !== "All") {
          url += `&status=${status}`; 
        }
        
        if (searchTerm && searchTerm.trim() !== "") {
          url += `&search=${encodeURIComponent(searchTerm)}`; 
        }
        
        return url;
      },
      keepUnusedDataFor: 0,
      providesTags: (result) =>
        result?.orders
          ? [...result.orders.map(({ id }) => ({ type: "Orders", id })), "Orders"]
          : ["Orders"],
    }),

    fetchOrderById: builder.query({
      query: (id) => `${ORDER_URL}/details/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${ORDER_URL}/update/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Orders", id }, "Orders"],
    }),

    deleteOrderById: builder.mutation({
      query: (id) => ({
        url: `${ORDER_URL}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Orders", id }, "Orders"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useFetchOrdersQuery,
  useFetchOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderByIdMutation,
} = orderApiSlice;

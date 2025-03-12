import { apiSlice } from "./apiSlice.js";
import { CART_URL } from "../constants.js";

const cartSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch user's cart
        getCart: builder.query({
            query: () => ({
                url: `${CART_URL}`,
                method: "GET",
            }),
            providesTags: ["Carts"],
        }),

        // Add a product to the cart
        addToCart: builder.mutation({
            query: ({ productId, quantity=1 }) => ({
                url: `${CART_URL}`,
                method: "POST",
                body: { productId, quantity },
            }),
            invalidatesTags: ["Carts"], // Refresh the cart after adding
        }),

        // Update cart item quantity
        updateCartItem: builder.mutation({
            query: ({ itemId, quantity }) => ({
                url: `${CART_URL}/${itemId}`,
                method: "PUT",
                body: { quantity },
            }),
            invalidatesTags: ["Carts"],
        }),

        // Remove an item from the cart
        removeCartItem: builder.mutation({
            query: (itemId) => ({
                url: `${CART_URL}/${itemId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Carts"],
        }),

        // Clear the entire cart
        clearCart: builder.mutation({
            query: () => ({
                url: `${CART_URL}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Carts"],
        }),
        orderCart: builder.mutation({
            query:()=>({
                url:`${CART_URL}/order`,
                method:"POST"
            }),
            invalidatesTags: ["Products"],
        })
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
    useOrderCartMutation
} = cartSlice;

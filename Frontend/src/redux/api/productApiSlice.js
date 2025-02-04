import { apiSlice } from "./apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "../constants.js";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImageFile : builder.mutation({
      query : (data) => ({
        url : `${UPLOAD_URL}/file`,
        method : "POST",
        body : data
      })
    }),

    fetchProducts: builder.query({
      query: ({ page, pageSize, category, searchTerm }) => {
        let url = `${PRODUCT_URL}/all?page=${page}&pageSize=${pageSize}`;
    
        if (category && category !== "All") {
          url += `&category=${category}`; // Add category filter
        }
    
        if (searchTerm && searchTerm.trim() !== "") {
          url += `&search=${encodeURIComponent(searchTerm)}`; // Add search term filter
        }
    
        return url;
      },
      keepUnusedDataFor: 0,
      providesTags: (result) =>
        result?.products
          ? [...result.products.map(({ id }) => ({ type: "Products", id })), "Products"]
          : ["Products"],
    }),
    

    fetchAllProducts: builder.query({
      query: () => `${PRODUCT_URL}/allProducts`,
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
    }),

    fetchProductById: builder.query({
      query: (id) => `${PRODUCT_URL}/details/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    addProductReview: builder.mutation({
      query: ({ productId, review }) => ({
        url: `${PRODUCT_URL}/addReview/${productId}`,
        method: "POST",
        body: review,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Products", id: productId }],
    }),

    fetchTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/topProduct`,
    }),

    filterProducts: builder.query({
      query: (filterParams) => {
        const params = new URLSearchParams(filterParams).toString();
        return `${PRODUCT_URL}/filter?${params}`;
      },
    }),

    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: `${PRODUCT_URL}/create`,
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...updatedProduct }) => ({
          url: `${PRODUCT_URL}/update/${id}`,
          method: "PUT",
          body: updatedProduct, // ✅ Send the updatedProduct directly
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }, "Products"],
  }),
  
  

    deleteProductById: builder.mutation({
      query: (id) => ({
        url: `${PRODUCT_URL}/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }, "Products"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useUploadImageFileMutation,
  useFetchAllProductsQuery,
  useFetchProductsQuery,
  useFetchProductByIdQuery,
  useAddProductReviewMutation,
  useFetchTopProductsQuery,
  useFilterProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductByIdMutation,
} = productApiSlice;

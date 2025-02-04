import { apiSlice } from "./apiSlice";
<<<<<<< HEAD
import { PRODUCT_URL, UPLOAD_URL } from "../constants.js";

=======
import { PRODUCT_URL } from "../constants";
const PAGE_SIZE = 6;


// Create productApiSlice by injecting endpoints into the base slice
>>>>>>> 851a4f9b61dafb34f318485fb3f4c2c835247443
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
<<<<<<< HEAD
      query: ({ page, pageSize, category, searchTerm }) => {
        let url = `${PRODUCT_URL}/all?page=${page}&pageSize=${pageSize}`;
    
        if (category && category !== "All") {
          url += `&category=${category}`; // Add category filter
=======
      query: ({ page, pageSize = PAGE_SIZE }) => {
        return`${PRODUCT_URL}/allProducts?page=${page}&limit=${pageSize}`
      },  
      transformResponse: (response) => {
        if (response.success) {
          return {
            products: response.data.productsWithImages,  // Extract product list
            page: response.data.page,
            pages: response.data.pages,
            hasMore: response.data.hasMore,
          };
        } else {
          console.error("Error fetching products:", response);
          return { products: [], page: 1, pages: 1, hasMore: false };
>>>>>>> 851a4f9b61dafb34f318485fb3f4c2c835247443
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
<<<<<<< HEAD
      query: (filterParams) => {
        const params = new URLSearchParams(filterParams).toString();
        return `${PRODUCT_URL}/filter?${params}`;
=======
      query: ({...filterParams}) => {
        const params = new URLSearchParams({...filterParams,limit:PAGE_SIZE}).toString();  // Convert filter params to query string
        return `${PRODUCT_URL}/filter?${params}`;  // GET /products/filter?category=electronics&price_max=1000
>>>>>>> 851a4f9b61dafb34f318485fb3f4c2c835247443
      },
      transformResponse: (response) => {
        if (response.success) {
          return {
            products: response.data.productsWithImages,  // Extract product list
            page: response.data.page,
            pages: response.data.pages,
            hasMore: response.data.hasMore,
          };
        } else {
          console.error("Error fetching products:", response);
          return { products: [], page: 1, pages: 1, hasMore: false };
        }
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

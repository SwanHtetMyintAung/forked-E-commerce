import { apiSlice } from "./apiSlice";
import { PRODUCT_URL } from "../constants";
const PAGE_SIZE = 6;


// Create productApiSlice by injecting endpoints into the base slice
export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all products
    fetchAllProducts: builder.query({
      query: () => `${PRODUCT_URL}/allProducts`,  // GET /products
    }),
    // Fetch products (for listing, may use pagination)
    fetchProducts: builder.query({
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
        }
      },
    }),
    

    // Fetch a product by its ID
    fetchProductById: builder.query({
      query: (id) => `${PRODUCT_URL}/${id}`,  // GET /products/:id
    }),

    // Add a review to a product
    addProductReview: builder.mutation({
      query: ({ productId, review }) => ({
        url: `${PRODUCT_URL}/${productId}/reviews`,  // POST /products/:id/reviews
        method: 'POST',
        body: review,
      }),
    }),

    // Fetch top-rated products
    fetchTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,  // GET /products/top
    }),

    // Filter products (e.g., by category, price range, etc.)
    filterProducts: builder.query({
      query: ({...filterParams}) => {
        const params = new URLSearchParams({...filterParams,limit:PAGE_SIZE}).toString();  // Convert filter params to query string
        return `${PRODUCT_URL}/filter?${params}`;  // GET /products/filter?category=electronics&price_max=1000
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

    // Create a new product
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: `${PRODUCT_URL}/create`,  // POST /products
        method: 'POST',
        body: newProduct,
      }),
    }),

    // Update an existing product
    updateProduct: builder.mutation({
      query: ({ id, updatedProduct }) => ({
        url: `${PRODUCT_URL}/${id}`,  // PUT /products/:id
        method: 'PUT',
        body: updatedProduct,
      }),
    }),

    // Delete a product by its ID
    deleteProductById: builder.mutation({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,  // DELETE /products/:id
        method: 'DELETE',
      }),
    }),
  }),

  overrideExisting: false,  // Don't override any existing endpoints
});

// Automatically generated hooks for use in React components
export const {
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
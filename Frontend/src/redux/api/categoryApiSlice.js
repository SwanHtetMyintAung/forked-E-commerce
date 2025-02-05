import { apiSlice } from "./apiSlice.js";
import { CATEGORY_URL } from "../constants.js";

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      fetchCategories: builder.query({
        query: ({ page = 1, pageSize = 5 }) =>
            `${CATEGORY_URL}/all?page=${page}&limit=${pageSize}`,
        transformResponse: (response) => response?.data || { categories: [], page: 1, pages: 1 },
        keepUnusedDataFor: 5,
        providesTags: (result) =>
          result?.categories?.length
            ? [...result.categories.map(({ _id }) => ({ type: "Categories", id: _id })), "Categories"]
            : ["Categories"],
    }),

    fetchAllCategories : builder.query({
      query : () => `${CATEGORY_URL}/categories`,
      keepUnusedDataFor : 5,
      providesTags : ["Products"]
    }),

        createCategories: builder.mutation({
            query: (newCategory) => ({
                url: `${CATEGORY_URL}/new`,
                method: "POST",
                body: newCategory,
            }),
            invalidatesTags: ["Categories"], // Refetch all categories after creating
        }),

        updateCategory: builder.mutation({
            query: ({ id, categoryName }) => ({
                url: `${CATEGORY_URL}/update/${id}`,
                method: "PUT",
                body: { categoryName },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Categories", id }, "Categories"],
        }),

        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `${CATEGORY_URL}/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Categories", id }, "Categories"],
        }),
    }),

    overrideExisting: false,
});

export const {
    useFetchCategoriesQuery,
    useCreateCategoriesMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchAllCategoriesQuery
} = categoryApiSlice;

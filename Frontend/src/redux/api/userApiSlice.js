import { apiSlice } from "./apiSlice.js";
import { USER_URL } from "../constants.js";


//These are all user api endpoints
export const userApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        //register api endpoint
        register : builder.mutation({
            query : (data) => ({
                url : `${USER_URL}/register`,
                method : 'POST',
                body : data
            })
        }),

        //login api endpoint
        login : builder.mutation({
            query : (data) => ({
                url : `${USER_URL}/login`,
                method : 'POST',
                body : data
            })
        }),

        //logout api endpoint
        logout : builder.mutation({
            query : () => ({
                url : `${USER_URL}/logout`,
                method : 'POST'
            })
        }),
        getUsers: builder.query({
            query: ({ page=1, pageSize=10 }) => ({ // Destructure page and pageSize from the argument object
                url: `${USER_URL}/all?page=${page}&pageSize=${pageSize}`,
                method: 'GET', // Explicitly set the method to GET
                transformResponse: (response) =>{ 
                    if(response.success === true){
                        return response.data;
                    }else{
                        return {users:[],page:1,pages:1}
                    }
                },
            }),
            providesTags: (result) => {
                if (result?.users) { // Check if result and result.users exist
                    return [
                        ...result.users.map(({ _id }) => ({ type: "Users", id: _id })), // Map over users to create individual tags
                        "Users", // General Users tag
                    ];
                } else {
                    return ["Users"]; // Default tag if no users are returned
                }
            },
        }),
        // banUser api endpoint
        banUser: builder.mutation({
            query: (userId) => ({
                url: `${USER_URL}/${userId}`, // Assuming your API uses user ID in the URL
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, userId) => [{ type: 'Users', id: userId }, 'Users'], // Invalidate specific user and general Users tag
        }),
        changePassword: builder.mutation({
            query: (data)=>({
                url:`${USER_URL}/${data._id}`,
                method:"PUT",
                body : data
            }),
            invalidatesTags: (result, error, userId) => [{ type: 'Users', id: userId }, 'Users'],
        }),
        updateAddress: builder.mutation({
            query:(data)=>({
                url:`${USER_URL}/${data._id}/address`,
                method:"PUT",
                body:data
            }),
        })
        
    })
});


export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetUsersQuery,
    useBanUserMutation,
    useChangePasswordMutation,
    useUpdateAddressMutation
} = userApiSlice;
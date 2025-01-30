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

        
    })
});


export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation
} = userApiSlice;
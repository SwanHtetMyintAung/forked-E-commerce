import { createSlice } from "@reduxjs/toolkit";

//init the user info for authentication 
const initialState = {
    userInfo : null
};

//Check if user info is stored and if the token is still valid
const storedUserInfo = localStorage.getItem("userInfo")
   ? JSON.parse(localStorage.getItem("userInfo"))
   : null;


   //Expiration
   const expirationTime = localStorage.getItem("expirationTime");

   //if the current time is before the expiration time , set userInfo
   if (storedUserInfo &&  expirationTime && new Date().getTime() < expirationTime) {
     initialState.userInfo = storedUserInfo;
   }else{
    //Clear any expired info
    localStorage.removeItem("userInfo");
    localStorage.removeItem("expirationTime");
   }



   //This is for authentication action
   const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        //Register & login action 
        setCredentials : (state, action) => {
            //User State
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));

            //Expiration Token
            const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expirationTime", expirationTime);
        },

        //Logout action
        logout : (state) => {
            state.userInfo = null,
            localStorage.clear();
        }
    }
   });

   //Export each reduer
   export const { setCredentials, logout } = authSlice.actions;
   
   //Export authSlice
   export default authSlice.reducer;
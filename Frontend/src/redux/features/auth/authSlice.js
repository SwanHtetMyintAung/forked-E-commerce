import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
};

// Check if user info is stored and token is valid
const storedUserInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const expirationTime = localStorage.getItem("expirationTime");

if (storedUserInfo && expirationTime && new Date().getTime() < expirationTime) {
  initialState.userInfo = storedUserInfo;
} else {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("expirationTime");
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Store token on login
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      // Set token expiration (30 days)
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("expirationTime", expirationTime);
    },

    // Logout action
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

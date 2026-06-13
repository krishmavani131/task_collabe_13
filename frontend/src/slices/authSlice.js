import { createSlice } from "@reduxjs/toolkit";

const loadUser = () => {
  const storedUser = localStorage.getItem("userInfo");

  return storedUser ? JSON.parse(storedUser) : null;
};

const initialState = {
  userInfo: loadUser(),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const user = action.payload;

      state.userInfo = user;
      localStorage.setItem("userInfo", JSON.stringify(user));
    },

    logout: (state) => {
      state.userInfo = null;

      localStorage.removeItem("userInfo");
      localStorage.removeItem("cart");
    },
  },
});

export const {
  setCredentials,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
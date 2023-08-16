import { createSlice } from '@reduxjs/toolkit';

const theme = localStorage.getItem("bitchest-theme-mode");

let initialState;
if (theme) {
  initialState = {
    mode: theme,
  }
}else{
  const isDarkThemeDefault = window.matchMedia("(prefers-color-scheme: dark)").matches;

  initialState = {
    mode: isDarkThemeDefault ? 'dark' : 'dark'
  };
}

export const UserSlice = createSlice({
  name: 'Theme',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("bitchest-theme-mode", state.mode)
    }
  }
});

export const { setThemeMode } = UserSlice.actions;

export default UserSlice.reducer;

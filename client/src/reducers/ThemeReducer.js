import { createSlice } from '@reduxjs/toolkit';

const theme = localStorage.getItem("bitchest-theme-mode");

let initialState;
if (theme) {
  initialState = {
    mode: theme,
  }
}else{
  // récupére le thème par défaut du navigateur
  const isDarkThemeDefault = window.matchMedia("(prefers-color-scheme: dark)").matches;

  initialState = {
    mode: isDarkThemeDefault ? 'dark' : 'light'
  };
}

export const UserSlice = createSlice({
  name: 'Theme',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      // stocke la préférence de l'utilisateur dans le local storage
      localStorage.setItem("bitchest-theme-mode", state.mode)
    }
  }
});

export const { setThemeMode } = UserSlice.actions;

export default UserSlice.reducer;

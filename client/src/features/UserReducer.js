import { createSlice } from '@reduxjs/toolkit';
import { getFromSessionStorage } from "../services/Storage.service";

let initialState;
const user = getFromSessionStorage('user');
if (user) {
  initialState = {
    user: user,
  }
}else{
  initialState = {
    user: {
      birthdate: "",
      city: "",
      country: "",
      email: "",
      firstname: "",
      lastname: "",
      gender: "",
      id: "",
      isAdmin: false,
      phone: "",
      service: ""
    }
  };
}

export const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    /**
     * Enregistre les informations de l'utilisateur dans le state global et dans le SessionStorage
     */
    setUserInfo: (state, action) => {
      state.user = action.payload.user;
    }
  }
});

export const { setUserInfo } = UserSlice.actions;

export default UserSlice.reducer;

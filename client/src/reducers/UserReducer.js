import { createSlice } from '@reduxjs/toolkit';
import { getAuthUser } from '../services/Api.service';

let initialState;
const user = await getAuthUser();
if (user) {
  initialState = {
    user: user,
  }
}else{
  initialState = {
    user: null
  };
}

export const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = {...state.user, ...action.payload};
    },
    clearUser: (state) => {
      state.user = null;
    }
  }
});

export const { setUser, clearUser } = UserSlice.actions;

export default UserSlice.reducer;

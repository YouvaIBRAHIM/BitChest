import { createSlice } from '@reduxjs/toolkit';
import { getUser } from '../services/Api.service';

let initialState;
const user = await getUser();
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
      state.user = action.payload.user;
    }
  }
});

export const { setUser } = UserSlice.actions;

export default UserSlice.reducer;

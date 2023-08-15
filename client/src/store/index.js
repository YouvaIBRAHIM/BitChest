import { configureStore, combineReducers } from '@reduxjs/toolkit';
import UserReducer from "../reducers/UserReducer";

// combine tous les reducers dans un seul reducer
const rootReducer = combineReducers({
    user: UserReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

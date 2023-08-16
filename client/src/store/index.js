import { configureStore, combineReducers } from '@reduxjs/toolkit';
import UserReducer from "../reducers/UserReducer";
import ThemeReducer from "../reducers/ThemeReducer";

// combine tous les reducers dans un seul reducer
const rootReducer = combineReducers({
    user: UserReducer,
    theme: ThemeReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

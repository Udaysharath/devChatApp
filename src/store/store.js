import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import userSlice from "./reducers/userSlice.js";
import chatSlice from "./reducers/chatSlice.js";

const rootReducer = combineReducers({
  userSlice,
  chatSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

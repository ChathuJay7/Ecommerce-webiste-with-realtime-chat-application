import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import chatReducer from "./Redux/Chat/ChatSlice";
import authReducer from "./Redux/Auth/AuthSlice";
import userReducer from "./Redux/User/UserSlice";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  chat: chatReducer,
  auth: authReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false, // Disable serializability checks
});

const store = configureStore({
  reducer: persistedReducer,
  middleware: customizedMiddleware,
});


export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

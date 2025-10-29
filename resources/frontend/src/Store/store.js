import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import modalReducer from "./slices/modalSlice";
import cartReducer from "./slices/cartSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        modal: modalReducer,
        cart: cartReducer,
    },
});

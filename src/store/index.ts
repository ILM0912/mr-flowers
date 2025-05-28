import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './CartSlice';
import authReducer from "./AuthSlice";
import productReducer from "./ProductSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		cart: cartReducer,
		product: productReducer,
	},
});

export default store;
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { saveCartMiddleware } from './CartSlice';
import authReducer from "./AuthSlice";
import productReducer from "./ProductSlice";
import orderReducer from "./OrderSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		cart: cartReducer,
		product: productReducer,
		order: orderReducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(saveCartMiddleware),
});

export default store;
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { saveCartMiddleware } from './services/CartSlice';
import authReducer from "./services/AuthSlice";
import productReducer from "./services/ProductSlice";
import orderReducer from "./services/OrderSlice";

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